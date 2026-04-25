import React from 'react';
import styles from './App.module.css';
import URLInput from './components/URLInput';
import VideoInfo from './components/VideoInfo';
import ProgressPanel from './components/ProgressPanel';
import ResultPanel from './components/ResultPanel';
import { useDownloader, STEPS } from './hooks/useDownloader';

export default function App() {
  const {
    step, videoInfo, selectedFormat, setSelectedFormat,
    progress, fileURL, error,
    fetchInfo, download, reset,
  } = useDownloader();

  return (
    <div className={styles.page}>
      {/* ── Noise texture overlay ───────────── */}
      <div className={styles.noise} aria-hidden="true" />

      {/* ── Glow blobs ─────────────────────── */}
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />

      <main className={styles.main}>
        {/* ── Header ──────────────────────────── */}
        <header className={`${styles.header} animate-fade-up`}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </span>
            VidFetch
          </div>
          <p className={styles.tagline}>
            Download videos from any platform — free, fast, no signup.
          </p>
        </header>

        {/* ── URL Input ───────────────────────── */}
        <div className={`${styles.block} animate-fade-up`} style={{ animationDelay: '0.08s' }}>
          <URLInput
            onSubmit={fetchInfo}
            loading={step === STEPS.FETCHING_INFO}
          />
        </div>

        {/* ── Error from info fetch ────────────── */}
        {step === STEPS.ERROR && (
          <div className={`${styles.block} animate-slide-in`}>
            <ResultPanel fileURL={null} error={error} onReset={reset} />
          </div>
        )}

        {/* ── Video Info + Format Picker ────────── */}
        {(step === STEPS.INFO_READY) && videoInfo && (
          <div className={`${styles.block} animate-slide-in`}>
            <VideoInfo
              info={videoInfo}
              selectedFormat={selectedFormat}
              onSelectFormat={setSelectedFormat}
              onDownload={download}
            />
          </div>
        )}

        {/* ── Progress ─────────────────────────── */}
        {step === STEPS.DOWNLOADING && (
          <div className={`${styles.block} animate-slide-in`}>
            <ProgressPanel progress={progress} />
          </div>
        )}

        {/* ── Result ────────────────────────────── */}
        {step === STEPS.DONE && (
          <div className={`${styles.block} animate-slide-in`}>
            <ResultPanel fileURL={fileURL} error={null} onReset={reset} />
          </div>
        )}

        {/* ── Footer ───────────────────────────── */}
        <footer className={styles.footer}>
          <p>For personal use only. Respect copyright laws.</p>
          <p>Supports YouTube · Instagram · Twitter · TikTok · Vimeo · and 1000+ more.</p>
        </footer>
      </main>
    </div>
  );
}