import { useState, useCallback, useRef } from 'react';
import { fetchVideoInfo, startDownload, pollJobStatus, getFileURL } from '../utils/api';

export const STEPS = {
  IDLE: 'idle',
  FETCHING_INFO: 'fetching_info',
  INFO_READY: 'info_ready',
  DOWNLOADING: 'downloading',
  DONE: 'done',
  ERROR: 'error',
};

export function useDownloader() {
  const [step, setStep] = useState(STEPS.IDLE);
  const [videoInfo, setVideoInfo] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [progress, setProgress] = useState({ percent: 0, speed: null, eta: null });
  const [jobId, setJobId] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [error, setError] = useState(null);
  const urlRef = useRef('');

  const reset = useCallback(() => {
    setStep(STEPS.IDLE);
    setVideoInfo(null);
    setSelectedFormat(null);
    setProgress({ percent: 0, speed: null, eta: null });
    setJobId(null);
    setFileURL(null);
    setError(null);
    urlRef.current = '';
  }, []);

  const fetchInfo = useCallback(async (url) => {
    setError(null);
    setStep(STEPS.FETCHING_INFO);
    urlRef.current = url;
    try {
      const info = await fetchVideoInfo(url);
      setVideoInfo(info);
      // Default: best video+audio
      const bestFormat = info.formats.find(f => f.hasVideo && f.hasAudio)
        || info.formats[0];
      setSelectedFormat(bestFormat?.id || 'bestvideo+bestaudio/best');
      setStep(STEPS.INFO_READY);
    } catch (err) {
      setError(extractError(err));
      setStep(STEPS.ERROR);
    }
  }, []);

  const download = useCallback(async () => {
    setError(null);
    setStep(STEPS.DOWNLOADING);
    setProgress({ percent: 0, speed: null, eta: null });
    try {
      const id = await startDownload(urlRef.current, selectedFormat);
      setJobId(id);

      await pollJobStatus(id, (state) => {
        setProgress({
          percent: state.progress || 0,
          speed: state.speed || null,
          eta: state.eta || null,
          totalSize: state.totalSize || null,
        });
      });

      setFileURL(getFileURL(id));
      setStep(STEPS.DONE);
    } catch (err) {
      setError(extractError(err));
      setStep(STEPS.ERROR);
    }
  }, [selectedFormat]);

  return {
    step, videoInfo, selectedFormat, setSelectedFormat,
    progress, jobId, fileURL, error,
    fetchInfo, download, reset,
  };
}

function extractError(err) {
  return err?.response?.data?.error || err?.message || 'Something went wrong';
}