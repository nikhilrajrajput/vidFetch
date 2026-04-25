const fs = require('fs');
const path = require('path');

const TEMP_DIR = path.join(__dirname, '../../temp');
const MAX_AGE_MS = 30 * 60 * 1000; // 30 minutes

function cleanOldFiles() {
  try {
    if (!fs.existsSync(TEMP_DIR)) return;
    const now = Date.now();
    const files = fs.readdirSync(TEMP_DIR);

    let cleaned = 0;
    files.forEach(file => {
      const filePath = path.join(TEMP_DIR, file);
      try {
        const { mtimeMs } = fs.statSync(filePath);
        if (now - mtimeMs > MAX_AGE_MS) {
          fs.unlinkSync(filePath);
          cleaned++;
        }
      } catch {
        // file may already be deleted
      }
    });

    if (cleaned > 0) console.log(`[Cleaner] Removed ${cleaned} stale file(s)`);
  } catch (err) {
    console.error('[Cleaner] Error:', err.message);
  }
}

module.exports = { cleanOldFiles };