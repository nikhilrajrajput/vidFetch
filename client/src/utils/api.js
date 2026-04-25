import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 35000,
});

/**
 * Fetch video metadata from a URL
 * @param {string} url
 */
export async function fetchVideoInfo(url) {
  const res = await api.post('/info', { url });
  return res.data.data;
}

/**
 * Queue a download job
 * @param {string} url
 * @param {string} format - yt-dlp format id or 'audio'
 * @returns {string} jobId
 */
export async function startDownload(url, format) {
  const res = await api.post('/download', { url, format });
  return res.data.jobId;
}

/**
 * Poll job status until done or failed
 * @param {string} jobId
 * @param {function} onProgress - called with status data
 * @returns {Promise<object>} final state
 */
export function pollJobStatus(jobId, onProgress) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/status/${jobId}`);
        const state = res.data.data;
        onProgress(state);

        if (state.status === 'done') {
          clearInterval(interval);
          resolve(state);
        } else if (state.status === 'failed') {
          clearInterval(interval);
          reject(new Error(state.error || 'Download failed'));
        }
      } catch (err) {
        clearInterval(interval);
        reject(err);
      }
    }, 1200);
  });
}

/**
 * Get the download URL for a completed job
 * @param {string} jobId
 */
export function getFileURL(jobId) {
  return `/api/file/${jobId}`;
}

export default api;