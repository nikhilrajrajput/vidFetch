import React, { useState } from 'react';
import styles from './URLInput.module.css';

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
    <div className={styles.wrapper}>
      <div className={styles.platforms}>
        {PLATFORMS.map(p => (
          <span key={p} className={styles.pill}>{p}</span>
        ))}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={`${styles.inputWrap} ${focused ? styles.focused : ''}`}>
          <span className={styles.icon}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </span>

          <input
            type="url"
            className={styles.input}
            placeholder="Paste video URL here..."
            value={url}
            onChange={e => setUrl(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={loading}
            autoComplete="off"
            spellCheck={false}
          />

          {!url && (
            <button type="button" className={styles.pasteBtn} onClick={handlePaste}>
              Paste
            </button>
          )}
          {url && (
            <button type="button" className={styles.clearBtn} onClick={() => setUrl('')}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={!url.trim() || loading}
        >
          {loading ? (
            <span className={styles.spinner} />
          ) : (
            <>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Analyse
            </>
          )}
        </button>
      </form>
    </div>
  );
}