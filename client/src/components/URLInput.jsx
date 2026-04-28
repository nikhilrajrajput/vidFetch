import React, { useState } from 'react';

const PLATFORMS = ['YouTube', 'Instagram', 'Twitter / X', 'TikTok', 'Vimeo', 'Facebook'];

export default function URLInput({ onSubmit, loading }) {
  const [url, setUrl] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (trimmed) onSubmit(trimmed);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.startsWith('http')) setUrl(text);
    } catch {}
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Platforms */}
      <div className="flex flex-wrap justify-center gap-2">
        {PLATFORMS.map((p) => (
          <span
            key={p}
            className="px-3 py-1 text-xs rounded-full bg-white/10 text-gray-300 backdrop-blur hover:bg-white/20 transition"
          >
            {p}
          </span>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">

        {/* Input Wrapper */}
        <div
          className={`flex items-center flex-1 rounded-xl border px-4 py-2 bg-white/5 backdrop-blur transition-all
          ${focused
            ? 'border-purple-500 shadow-[0_0_0_1px_rgba(168,85,247,0.5)]'
            : 'border-white/10'}`}
        >
          {/* Icon */}
          <span className="text-gray-400 mr-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </span>

          {/* Input */}
          <input
            type="url"
            placeholder="Paste video URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={loading}
            autoComplete="off"
            spellCheck={false}
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"
          />

          {/* Paste / Clear */}
          {!url ? (
            <button
              type="button"
              onClick={handlePaste}
              className="text-sm text-purple-400 hover:text-purple-300 transition"
            >
              Paste
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setUrl('')}
              className="text-gray-400 hover:text-white transition"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!url.trim() || loading}
          className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium disabled:opacity-50 hover:opacity-90 transition"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Analyse
            </>
          )}
        </button>
      </form>
    </div>
  );
}