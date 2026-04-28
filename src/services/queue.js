/**
 * queue.js
 *
 * Tries to connect to Redis + BullMQ for production-grade queuing.
 * If Redis is unavailable, falls back to a simple in-memory queue
 * so the app still works for local development without Redis.
 */

const { v4: uuidv4 } = require('uuid');
const { downloadVideo } = require('./downloader');

// ── Shared in-memory job state ───────────────────────────────────
const jobState = new Map();

function setJobState(jobId, data) {
  jobState.set(jobId, { ...jobState.get(jobId), ...data, updatedAt: Date.now() });
}

function getJobState(jobId) {
  return jobState.get(jobId) || null;
}

// ── In-memory queue (fallback / dev mode) ────────────────────────
class InMemoryQueue {
  constructor() {
    this._active = 0;
    this._concurrency = 3;
    this._pending = [];
  }

  async add(name, data) {
    const jobId = uuidv4();
    setJobState(jobId, { status: 'queued', progress: 0 });

    const run = async () => {
      this._active++;
      setJobState(jobId, { status: 'processing', progress: 0 });

      try {
        const { url, format } = data;
        const result = await downloadVideo(url, format, ({ percent, totalSize, speed, eta }) => {
          setJobState(jobId, { status: 'processing', progress: percent, totalSize, speed, eta });
        });

        setJobState(jobId, {
          status: 'done',
          progress: 100,
          fileId: result.fileId,
          filePath: result.filePath,
          ext: result.ext,
        });
        console.log(`[InMemQueue] Job ${jobId} completed`);
      } catch (err) {
        console.error(`[InMemQueue] Job ${jobId} failed:`, err.message);
        setJobState(jobId, { status: 'failed', error: err.message });
      } finally {
        this._active--;
        if (this._pending.length > 0) {
          const next = this._pending.shift();
          next();
        }
      }
    };

    if (this._active < this._concurrency) {
      run(); // fire-and-forget — intentional
    } else {
      this._pending.push(run);
    }

    return { id: jobId };
  }
}

// ── Try Redis + BullMQ; fall back to InMemoryQueue ───────────────
let downloadQueue = null;

async function initQueue() {
  try {
    const IORedis = require('ioredis');
    const { Queue, Worker } = require('bullmq');

    const connection = new IORedis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      maxRetriesPerRequest: null,
      connectTimeout: 3000,
      lazyConnect: true,
    });

    // Probe the connection before committing
    await connection.connect();
    await connection.ping();

    console.log('✅ [Queue] Redis connected — using BullMQ');

    const bQueue = new Queue('video-downloads', {
      connection,
      defaultJobOptions: {
        attempts: 1,                          // no retries — stall = real failure for downloads
        removeOnComplete: { age: 3600 },
        removeOnFail: { age: 3600 },
      },
    });

    const worker = new Worker(
      'video-downloads',
      async (job) => {
        const { url, format } = job.data;
        setJobState(job.id, { status: 'processing', progress: 0 });

        // Extend the lock every 30s so BullMQ never thinks the job stalled
        const lockExtender = setInterval(async () => {
          try {
            await job.extendLock(job.token, 60000);
          } catch {
            // job may have already finished — safe to ignore
          }
        }, 30000);

        try {
          const result = await downloadVideo(url, format, ({ percent, totalSize, speed, eta }) => {
            job.updateProgress(percent);
            setJobState(job.id, { status: 'processing', progress: percent, totalSize, speed, eta });
          });

          setJobState(job.id, {
            status: 'done', progress: 100,
            fileId: result.fileId, filePath: result.filePath, ext: result.ext,
          });
          return result;
        } finally {
          clearInterval(lockExtender);
        }
      },
      {
        connection,
        concurrency: 3,
        lockDuration: 60000,        // 60s initial lock (default is 30s — too short for big downloads)
        stalledInterval: 30000,     // check for stalled jobs every 30s
        maxStalledCount: 0,         // never auto-retry a stalled job — mark as failed immediately
      }
    );

    worker.on('failed', (job, err) => {
      console.error(`[Worker] Job ${job.id} failed:`, err.message);
      setJobState(job.id, { status: 'failed', error: err.message });
    });

    connection.on('error', err => {
      console.warn('[Redis] Runtime error:', err.message);
    });

    downloadQueue = bQueue;

  } catch (err) {
    console.warn(`\n⚠️  [Queue] Redis not available: ${err.message}`);
    console.warn('⚠️  [Queue] Running with in-memory queue (fine for development)');
    console.warn('⚠️  [Queue] To enable Redis: install it and run "redis-server"\n');
    downloadQueue = new InMemoryQueue();
  }
}

// Bootstrap immediately
initQueue().catch(() => {
  downloadQueue = new InMemoryQueue();
});

// ── Proxy wrapper — waits until queue is ready ────────────────────
const queueProxy = {
  async add(name, data) {
    let waited = 0;
    while (!downloadQueue && waited < 5000) {
      await new Promise(r => setTimeout(r, 100));
      waited += 100;
    }
    if (!downloadQueue) {
      // Last resort: use in-memory
      downloadQueue = new InMemoryQueue();
    }
    return downloadQueue.add(name, data);
  },
};

module.exports = { downloadQueue: queueProxy, getJobState, setJobState };