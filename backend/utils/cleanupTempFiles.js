import fs from "fs/promises";
import path from "path";

const TEMP_ROOT = path.join(process.cwd(), "uploads", "temp");
const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Cleans up temporary files older than MAX_AGE in all subfolders of uploads/temp
 * Should be run periodically (e.g., daily) using a cron job
 */
export async function cleanupTempFiles() {
  try {
    // Check if TEMP_ROOT exists
    await fs.access(TEMP_ROOT);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log("Temp root directory does not exist. No need of further processing.");
      return;
    }
    throw err;
  }

  try {
    const subfolders = await fs.readdir(TEMP_ROOT, { withFileTypes: true });
    const now = Date.now();

    for (const dirent of subfolders) {
      if (!dirent.isDirectory()) continue;
      const folderPath = path.join(TEMP_ROOT, dirent.name);
      let files;
      try {
        files = await fs.readdir(folderPath);
      } catch (err) {
        // Skip if folder can't be read
        continue;
      }
      for (const file of files) {
        const filePath = path.join(folderPath, file);
        try {
          const stats = await fs.stat(filePath);
          if (now - stats.mtime.getTime() > MAX_AGE) {
            await fs.unlink(filePath);
          }
        } catch (error) {
          console.error(`Error deleting temporary file ${filePath}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error cleaning up temporary files:", error);
  }
}