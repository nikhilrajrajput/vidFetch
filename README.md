# 🎬 Video Downloader API

A production-ready backend service built with **Node.js** and **Express** that enables users to fetch video metadata and download videos in multiple qualities (360p–1080p) as a **single file with audio**.

Designed with scalability and performance in mind, the system leverages **queue-based processing**, **rate limiting**, and **optimized download strategies** for reliable and efficient operation.

---

## 🚀 Key Features

- 🎥 Download videos with **audio included (single file)**
- 🎚️ Quality selection: `360p`, `480p`, `720p`, `1080p`, `auto`
- ⚡ Optimized download performance (parallel fragments + retries)
- 📊 Real-time progress tracking via job status API
- 🔄 Background job processing using **BullMQ**
- 🧠 Redis-backed queue with **in-memory fallback**
- 🔐 Security layer with **Helmet, CORS, and Rate Limiting**
- 🧹 Automatic cleanup of temporary files
- 🌐 Multi-platform support (YouTube, Instagram, Twitter, etc.)
- ☁️ Cloud deployment ready (Railway)

---

## 🛠️ Tech Stack

| Category      | Technology |
|--------------|-----------|
| Backend       | Node.js, Express |
| Queue System  | BullMQ, Redis |
| Downloader    | yt-dlp-exec |
| Security      | Helmet, CORS, express-rate-limit |
| Utilities     | UUID, FS, Path |

---

## 📁 Project Structure
- video-downloader/
-├── src/
-│ ├── routes/ # API routes
-│ ├── services/
-│ │ ├── downloader.js # yt-dlp integration
-│ │ ├── queue.js # Queue & worker logic
-│ │ └── cleaner.js # Temp file cleanup
-│ ├── middleware/ # Validation & rate limiting
-│ └── app.js # Application entry point
-├── public/ # Optional frontend
-├── temp/ # Temporary downloads (ignored)
-└── package.json
