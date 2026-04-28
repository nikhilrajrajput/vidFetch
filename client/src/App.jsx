import React from 'react';
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
    <div className="relative min-h-screen bg-gray-950 text-white overflow-hidden">

      {/* ── Noise texture ── */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')]" />

      {/* ── Glow blobs ── */}
      <div className="absolute -top-24 -left-24 w-[300px] h-[300px] bg-purple-500 rounded-full blur-[120px] opacity-30" />
      <div className="absolute -bottom-24 -right-24 w-[300px] h-[300px] bg-pink-500 rounded-full blur-[120px] opacity-30" />

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-10 space-y-6">

        {/* ── Header ── */}
        <header className="text-center animate-fade-up">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold">
            <span className="p-2 bg-white/10 rounded-xl backdrop-blur">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </span>
            VidFetch
          </div>

          <p className="text-gray-400 mt-2">
            Download videos from any platform — free, fast, no signup.
          </p>
        </header>

        {/* ── URL Input ── */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur animate-fade-up">
          <URLInput
            onSubmit={fetchInfo}
            loading={step === STEPS.FETCHING_INFO}
          />
        </div>

        {/* ── Error ── */}
        {step === STEPS.ERROR && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 animate-slide-in">
            <ResultPanel fileURL={null} error={error} onReset={reset} />
          </div>
        )}

        {/* ── Video Info ── */}
        {step === STEPS.INFO_READY && videoInfo && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur animate-slide-in">
            <VideoInfo
              info={videoInfo}
              selectedFormat={selectedFormat}
              onSelectFormat={setSelectedFormat}
              onDownload={download}
            />
          </div>
        )}

        {/* ── Progress ── */}
        {step === STEPS.DOWNLOADING && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur animate-slide-in">
            <ProgressPanel progress={progress} />
          </div>
        )}

        {/* ── Result ── */}
        {step === STEPS.DONE && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5 animate-slide-in">
            <ResultPanel fileURL={fileURL} error={null} onReset={reset} />
          </div>
        )}

        {/* ── Footer ── */}
        <footer className="text-center text-gray-500 text-sm pt-6">
          <p>For personal use only. Respect copyright laws.</p>
          <p className="mt-1">
            Supports YouTube · Instagram · Twitter · TikTok · Vimeo · and 1000+ more.
          </p>
        </footer>

      </main>
    </div>
  );
}