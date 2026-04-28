import React from 'react';

export default function ResultPanel({ fileURL, error, onReset }) {
  const isSuccess = !!fileURL;

  return (
    <div
      className={`rounded-2xl p-6 border backdrop-blur animate-slide-in flex flex-col items-center text-center gap-4
      ${isSuccess
        ? 'bg-green-500/10 border-green-500/20'
        : 'bg-red-500/10 border-red-500/20'}`}
    >

      {/* Icon */}
      <div
        className={`p-3 rounded-full
        ${isSuccess ? 'bg-green-500/20' : 'bg-red-500/20'}`}
      >
        {isSuccess ? (
          <svg
            width="28"
            height="28"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            className="text-green-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : (
          <svg
            width="28"
            height="28"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            className="text-red-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
      </div>

      {/* Message */}
      <div>
        <div className="text-lg font-semibold text-white">
          {isSuccess ? 'Ready to download!' : 'Something went wrong'}
        </div>
        <div className="text-sm text-gray-400 mt-1 max-w-md">
          {isSuccess
            ? 'Your file is processed and ready. Click below to save it.'
            : error}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center mt-2">

        {isSuccess && (
          <a
            href={fileURL}
            download
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Save file
          </a>
        )}

        <button
          onClick={onReset}
          className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
        >
          {isSuccess ? 'Download another' : 'Try again'}
        </button>
      </div>

    </div>
  );
}