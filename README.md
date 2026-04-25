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
