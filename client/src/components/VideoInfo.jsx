import React from 'react';
import styles from './VideoInfo.module.css';

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

const QUALITY_ORDER = ['2160p', '1440p', '1080p', '720p', '480p', '360p', '240p', '144p'];

export default function VideoInfo({ info, selectedFormat, onSelectFormat, onDownload }) {
  // Grouped: video formats + audio-only
  const videoFormats = info.formats
    .filter(f => f.hasVideo)
    .slice(0, 8);

  const audioFormat = { id: 'audio', quality: 'Audio only (MP3)', ext: 'mp3', hasAudio: true, hasVideo: false };
  const allFormats = [...videoFormats, audioFormat];

  return (
    <div className={`${styles.card} animate-slide-in`}>
      {/* ── Thumbnail + meta ─────────────────────── */}
      <div className={styles.meta}>
        {info.thumbnail && (
          <div className={styles.thumbWrap}>
            <img src={info.thumbnail} alt={info.title} className={styles.thumb} />
            <div className={styles.duration}>{formatDuration(info.duration)}</div>
          </div>
        )}
        <div className={styles.metaText}>
          <div className={styles.platform}>{info.platform}</div>
          <h2 className={styles.title}>{info.title}</h2>
          <div className={styles.metaRow}>
            {info.uploader && <span className={styles.chip}>{info.uploader}</span>}
            {info.viewCount && <span className={styles.chip}>{formatViews(info.viewCount)}</span>}
          </div>
        </div>
      </div>

      {/* ── Format picker ─────────────────────────── */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Choose format & quality</div>
        <div className={styles.formats}>
          {allFormats.map(f => {
            const isSelected = selectedFormat === f.id;
            return (
              <button
                key={f.id}
                className={`${styles.formatBtn} ${isSelected ? styles.selected : ''}`}
                onClick={() => onSelectFormat(f.id)}
              >
                <span className={styles.fIcon}>
                  {f.hasVideo ? (
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  )}
                </span>
                <span className={styles.fLabel}>{f.quality}</span>
                {f.ext && <span className={styles.fExt}>.{f.ext}</span>}
                {f.filesize && <span className={styles.fSize}>{formatSize(f.filesize)}</span>}
                {f.fps && <span className={styles.fFps}>{f.fps}fps</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Download button ───────────────────────── */}
      <button className={styles.downloadBtn} onClick={onDownload}>
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download
      </button>
    </div>
  );
}