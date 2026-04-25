const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const dotenv= require('dotenv');


dotenv.config()
const downloadRoutes = require('./routes/download');
const { cleanOldFiles } = require('./services/cleaner');

const app = express();
const PORT = process.env.PORT || 4000;

// ── Security Middleware ─────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));

// ── Rate Limiting ───────────────────────────────────────────────
const infoLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: { error: 'Too many info requests, please slow down.' },
});

const downloadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many download requests, please try again later.' },
});

// ── Ensure temp dir exists ──────────────────────────────────────
const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

// ── Routes ──────────────────────────────────────────────────────
app.use('/api/info', infoLimiter);
app.use('/api/download', downloadLimiter);
app.use('/api', downloadRoutes);

// ── Health check ────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ── Global error handler ────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// ── Cleanup cron: every 10 minutes ─────────────────────────────
setInterval(cleanOldFiles, 10 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

module.exports = app;