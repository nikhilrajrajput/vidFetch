import React from 'react';

export default function ProgressPanel({ progress }) {
  const { percent = 0, speed, eta, totalSize } = progress;
  const pct = Math.min(100, Math.round(percent));

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur animate-slide-in space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="p-2 bg-white/10 rounded-xl">
            <svg
              width="22"
              height="22"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </div>

          {/* Title */}
          <div>
            <div className="font-semibold text-white">
              Downloading…
            </div>
            <div className="text-sm text-gray-400">
              Please keep this tab open
            </div>
          </div>
        </div>

        {/* Percentage */}
        <div className="text-lg font-bold text-white">
          {pct}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        {speed && (
          <div className="bg-white/5 p-3 rounded-xl text-center">
            <div className="text-gray-400 text-xs">Speed</div>
            <div className="text-white font-medium">{speed}</div>
          </div>
        )}

        {eta && (
          <div className="bg-white/5 p-3 rounded-xl text-center">
            <div className="text-gray-400 text-xs">ETA</div>
            <div className="text-white font-medium">{eta}</div>
          </div>
        )}

        {totalSize && (
          <div className="bg-white/5 p-3 rounded-xl text-center">
            <div className="text-gray-400 text-xs">Size</div>
            <div className="text-white font-medium">{totalSize}</div>
          </div>
        )}
      </div>

    </div>
  );
}