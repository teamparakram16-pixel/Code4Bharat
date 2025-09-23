// utils/removeLocalFiles.js
import fs from "fs/promises";

/**
 * Removes an array of file paths from disk.
 * @param {string[]} filePaths - Array of file paths to remove
 * @returns {Promise<void>}
 */
const removeLocalFiles = async (filePaths = []) => {
  for (const filePath of filePaths) {
    try {
      await fs.unlink(filePath);
    } catch (err) {
      // Log but don't throw to allow cleanup of all files
      console.error(`Error removing file ${filePath}:`, err.message);
    }
  }
};

export default removeLocalFiles;
