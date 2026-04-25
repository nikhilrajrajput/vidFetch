# 🎬 Video Downloader API

A scalable backend service built with **Node.js** and **Express** that allows users to fetch video metadata and download videos in multiple qualities (360p–1080p) as a **single file with audio**.

---

## 🚀 Features

- 🎥 Download videos with audio (single file, no merging issues)
- 🎚️ Quality selection (360p, 480p, 720p, 1080p, auto)
- ⚡ Optimized download speed (parallel fragments + retries)
- 📊 Real-time progress tracking
- 🔄 Background job processing using BullMQ
- 🧠 Redis + in-memory fallback queue
- 🔐 Security middleware (Helmet, CORS, Rate Limiting)
- 🧹 Auto cleanup of old files
- 🌐 Supports multiple platforms (YouTube, Instagram, Twitter, etc.)
- ☁️ Deployable on Railway

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express
- **Queue:** BullMQ, Redis
- **Downloader:** yt-dlp-exec
- **Utilities:** UUID, FS, Path
- **Security:** Helmet, Express Rate Limit, CORS

---

## 📁 Project Structure
<img width="1440" height="1160" alt="image" src="https://github.com/user-attachments/assets/2c6a024b-b7ab-4221-bccb-4df6ae9b4274" />

## 📁 Project Setup

video-downloader/
├── src/
│   ├── routes/          # Express routes
│   ├── services/
│   │   ├── downloader.js   # yt-dlp wrapper
│   │   ├── queue.js        # BullMQ setup
│   │   └── cleaner.js      # temp file cleanup
│   ├── middleware/      # rate limiter, validator
│   └── app.js
├── public/              # frontend HTML/JS
├── temp/                # downloaded files (gitignored)
└── package.json

