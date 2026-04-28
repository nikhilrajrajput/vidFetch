import React from 'react';

function formatDuration(seconds) {
  if (!seconds) return '--';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`;
}

function formatSize(bytes) {
  if (!bytes) return null;
  if (bytes > 1e9) return `~${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes > 1e6) return `~${(bytes / 1e6).toFixed(0)} MB`;
  return `~${(bytes / 1e3).toFixed(0)} KB`;
}

function formatViews(n) {
  if (!n) return null;
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B views`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M views`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K views`;
  return `${n} views`;
}

export default function VideoInfo({ info, selectedFormat, onSelectFormat, onDownload }) {
  const videoFormats = info.formats.filter(f => f.hasVideo).slice(0, 8);

  const audioFormat = {
    id: 'audio',
    quality: 'Audio only (MP3)',
    ext: 'mp3',
    hasAudio: true,
    hasVideo: false
  };

  const allFormats = [...videoFormats, audioFormat];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur animate-slide-in space-y-6">

      {/* ── Meta Section ── */}
      <div className="flex flex-col sm:flex-row gap-4">

        {/* Thumbnail */}
        {info.thumbnail && (
          <div className="relative w-full sm:w-48 shrink-0">
            <img
              src={info.thumbnail}
              alt={info.title}
              className="w-full h-28 object-cover rounded-xl"
            />
            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
              {formatDuration(info.duration)}
            </div>
          </div>
        )}

        {/* Text */}
        <div className="flex-1">
          <div className="text-xs text-purple-400 font-medium mb-1">
            {info.platform}
          </div>

          <h2 className="text-lg font-semibold text-white line-clamp-2">
            {info.title}
          </h2>

          <div className="flex flex-wrap gap-2 mt-2 text-xs">
            {info.uploader && (
              <span className="bg-white/10 px-2 py-1 rounded-full text-gray-300">
                {info.uploader}
              </span>
            )}
            {info.viewCount && (
              <span className="bg-white/10 px-2 py-1 rounded-full text-gray-300">
                {formatViews(info.viewCount)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Format Picker ── */}
      <div>
        <div className="text-sm text-gray-400 mb-3">
          Choose format & quality
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {allFormats.map((f) => {
            const isSelected = selectedFormat === f.id;

            return (
              <button
                key={f.id}
                onClick={() => onSelectFormat(f.id)}
                className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-sm transition
                ${isSelected
                  ? 'bg-purple-500/20 border-purple-500 text-white'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'}`}
              >
                {/* Icon */}
                <span className="text-gray-400">
                  {f.hasVideo ? (
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  )}
                </span>

                {/* Quality */}
                <span className="font-medium">{f.quality}</span>

                {/* Extra info */}
                <div className="flex flex-wrap gap-1 text-xs text-gray-400">
                  {f.ext && <span>.{f.ext}</span>}
                  {f.filesize && <span>{formatSize(f.filesize)}</span>}
                  {f.fps && <span>{f.fps}fps</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Download Button ── */}
      <button
        onClick={onDownload}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition"
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download
      </button>
    </div>
  );
}