import React from 'react';
import styles from './ProgressPanel.module.css';

export default function ProgressPanel({ progress }) {
  const { percent = 0, speed, eta, totalSize } = progress;
  const pct = Math.min(100, Math.round(percent));

  return (
    <div className={`${styles.card} animate-slide-in`}>
      <div className={styles.header}>
        <div className={styles.iconWrap}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>
        <div>
          <div className={styles.title}>Downloading…</div>
          <div className={styles.subtitle}>Please keep this tab open</div>
        </div>
        <div className={styles.pct}>{pct}%</div>
      </div>

      {/* Progress bar */}
      <div className={styles.barWrap}>
        <div className={styles.bar} style={{ width: `${pct}%` }} />
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        {speed && (
          <div className={styles.stat}>
            <span className={styles.statLabel}>Speed</span>
            <span className={styles.statVal}>{speed}</span>
          </div>
        )}
        {eta && (
          <div className={styles.stat}>
            <span className={styles.statLabel}>ETA</span>
            <span className={styles.statVal}>{eta}</span>
          </div>
        )}
        {totalSize && (
          <div className={styles.stat}>
            <span className={styles.statLabel}>Size</span>
            <span className={styles.statVal}>{totalSize}</span>
          </div>
        )}
      </div>
    </div>
  );
}