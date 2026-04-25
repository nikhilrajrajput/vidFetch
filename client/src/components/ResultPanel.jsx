import React from 'react';
import styles from './ResultPanel.module.css';

export default function ResultPanel({ fileURL, error, onReset }) {
  const isSuccess = !!fileURL;

  return (
    <div className={`${styles.card} ${isSuccess ? styles.success : styles.error} animate-slide-in`}>
      <div className={styles.iconWrap}>
        {isSuccess ? (
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>

      <div className={styles.message}>
        <div className={styles.title}>{isSuccess ? 'Ready to download!' : 'Something went wrong'}</div>
        <div className={styles.subtitle}>
          {isSuccess
            ? 'Your file is processed and ready. Click below to save it.'
            : error}
        </div>
      </div>

      <div className={styles.actions}>
        {isSuccess && (
          <a href={fileURL} download className={styles.dlBtn}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Save file
          </a>
        )}
        <button className={styles.resetBtn} onClick={onReset}>
          {isSuccess ? 'Download another' : 'Try again'}
        </button>
      </div>
    </div>
  );
}