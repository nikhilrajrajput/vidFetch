const ytdlp = require('yt-dlp-exec');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const TEMP_DIR = path.join(__dirname, '../../temp');
const COOKIES_PATH = path.join(__dirname, '../../cookies/cookies.txt'); // optional

// ── Validate URL (allow http/https, block local/internal) ────────
function validateURL(url) {
  try {
    const parsed = new URL(url);

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Only HTTP/HTTPS URLs are allowed');
    }

    const hostname = parsed.hostname;

    // 🚫 block local/internal targets (SSRF protection)
    const blocked = ['localhost', '127.0.0.1', '0.0.0.0'];
    if (blocked.includes(hostname)) {
      throw new Error('Access to local network is not allowed');
    }

    return true;
  } catch (e) {
    throw new Error(e.message || 'Invalid URL');
  }
}

// ── Build common yt-dlp options ──────────────────────────────────
function buildBaseOptions({ output, isAudioOnly }) {
  const base = {
    format: isAudioOnly ? 'bestaudio/best' : 'b[ext=mp4]/best', // single file A+V
    output,
    noPlaylist: true,
    noWarnings: true,
    newline: true,

    // 🚀 speed optimizations
    concurrentFragments: 5,
    retries: 10,
    fragmentRetries: 10,
    bufferSize: '16K',
    httpChunkSize: '10M',

    // ⚡ optional aria2 boost
    ...(process.env.USE_ARIA2 && {
      externalDownloader: 'aria2c',
      externalDownloaderArgs: ['-x', '16', '-k', '1M', '-s', '16'],
    }),
  };

  // 🎧 audio extraction
  if (isAudioOnly) {
    base.extractAudio = true;
    base.audioFormat = 'mp3';
    base.audioQuality = 0;
  }

  // 🔐 cookies support (for private videos you have access to)
  if (fs.existsSync(COOKIES_PATH)) {
    base.cookies = COOKIES_PATH;
  }

  return base;
}

// ── Get Video Info ──────────────────────────────────────────────
async function getVideoInfo(url) {
  validateURL(url);

  try {
    const opts = {
      dumpSingleJson: true,
      noWarnings: true,
      noPlaylist: true,
    };

    // include cookies if available
    if (fs.existsSync(COOKIES_PATH)) {
      opts.cookies = COOKIES_PATH;
    }

    const raw = await ytdlp(url, opts);
    return formatVideoInfo(raw);
  } catch (err) {
    throw new Error(err.stderr || err.message || 'Failed to fetch video info');
  }
}

// ── Download Video (single file) ─────────────────────────────────
async function downloadVideo(url, format = 'video', onProgress) {
  validateURL(url);

  const fileId = uuidv4();
  const outputTemplate = path.join(TEMP_DIR, `${fileId}.%(ext)s`);
  const isAudioOnly = format === 'audio';

  try {
    const proc = ytdlp.exec(
      url,
      buildBaseOptions({ output: outputTemplate, isAudioOnly })
    );

    let lastProgress = 0;

    proc.stdout.on('data', (data) => {
      const line = data.toString();

      const match = line.match(
        /\[download\]\s+([\d.]+)%\s+of\s+([\d.]+\w+)\s+at\s+([\d.]+\w+\/s)\s+ETA\s+([\d:]+)/
      );

      if (match && onProgress) {
        const percent = parseFloat(match[1]);

        if (percent !== lastProgress) {
          lastProgress = percent;

          onProgress({
            percent,
            totalSize: match[2],
            speed: match[3],
            eta: match[4],
          });
        }
      }
    });

    await proc;

    // resolve file
    const files = fs.readdirSync(TEMP_DIR).filter(f => f.startsWith(fileId));

    if (files.length === 0) {
      throw new Error('Downloaded file not found');
    }

    const filePath = path.join(TEMP_DIR, files[0]);

    return {
      fileId,
      filePath,
      ext: path.extname(files[0]).slice(1),
    };

  } catch (err) {
    throw new Error(err.stderr || err.message || 'Download failed');
  }
}

// ── Format Video Info ───────────────────────────────────────────
function formatVideoInfo(raw) {
  // Build clean format list — required by the React frontend
  const seen = new Set();
  const formats = (raw.formats || [])
    .filter(f => {
      if (!f.vcodec && !f.acodec) return false;
      if (f.format_note === 'storyboard') return false;
      const key = `${f.height || 'audio'}-${f.ext}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map(f => ({
      id: f.format_id,
      ext: f.ext,
      quality: f.format_note || (f.height ? `${f.height}p` : 'audio'),
      height: f.height || null,
      filesize: f.filesize || f.filesize_approx || null,
      hasVideo: f.vcodec !== 'none' && !!f.vcodec,
      hasAudio: f.acodec !== 'none' && !!f.acodec,
      fps: f.fps || null,
    }))
    .sort((a, b) => (b.height || 0) - (a.height || 0));

  return {
    title: raw.title,
    description: raw.description ? raw.description.slice(0, 200) : null,
    thumbnail: raw.thumbnail,
    duration: raw.duration,
    uploader: raw.uploader,
    viewCount: raw.view_count,
    platform: raw.extractor_key,
    formats, // ✅ required by VideoInfo component
  };
}

module.exports = { getVideoInfo, downloadVideo, validateURL };