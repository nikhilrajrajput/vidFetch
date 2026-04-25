const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');
const { getVideoInfo } = require('../services/downloader');
const { downloadQueue, getJobState } = require('../services/queue');

// ── POST /api/info ───────────────────────────────────────────────
router.post(
  '/info',
  body('url').isURL({ require_protocol: true }).withMessage('Invalid URL'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    try {
      const info = await getVideoInfo(req.body.url);
      res.json({ success: true, data: info });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/download ───────────────────────────────────────────
router.post(
  '/download',
  body('url').isURL({ require_protocol: true }).withMessage('Invalid URL'),
  body('format').optional().isString(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    try {
      const { url, format = 'bestvideo+bestaudio/best' } = req.body;

      const job = await downloadQueue.add('download', { url, format });

      res.json({ success: true, jobId: job.id });
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /api/status/:jobId ───────────────────────────────────────
router.get('/status/:jobId', (req, res) => {
  const state = getJobState(req.params.jobId);

  if (!state) {
    return res.status(404).json({ error: 'Job not found' });
  }

  res.json({ success: true, data: state });
});

// ── GET /api/file/:jobId ─────────────────────────────────────────
router.get('/file/:jobId', (req, res) => {
  const state = getJobState(req.params.jobId);

  if (!state) return res.status(404).json({ error: 'Job not found' });
  if (state.status !== 'done') return res.status(400).json({ error: 'File not ready yet' });

  const filePath = state.filePath;

  if (!fs.existsSync(filePath)) {
    return res.status(410).json({ error: 'File has expired, please re-download' });
  }

  const stat = fs.statSync(filePath);
  const ext = state.ext || 'mp4';
  const filename = `video_${req.params.jobId.slice(0, 8)}.${ext}`;

  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', ext === 'mp3' ? 'audio/mpeg' : 'video/mp4');
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Cache-Control', 'no-store');

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);

  stream.on('error', err => {
    console.error('[File Stream Error]', err.message);
    if (!res.headersSent) res.status(500).json({ error: 'Failed to stream file' });
  });
});

// ── DELETE /api/file/:jobId (cleanup on demand) ──────────────────
router.delete('/file/:jobId', (req, res) => {
  const state = getJobState(req.params.jobId);
  if (state?.filePath && fs.existsSync(state.filePath)) {
    fs.unlinkSync(state.filePath);
  }
  res.json({ success: true });
});

module.exports = router;