import { exec } from "child_process";
import { existsSync, unlinkSync } from "fs";
import { cwd } from "process";

/**
 * 
 * @param {string} cmd 
 * @param {import("child_process").ExecOptions} options 
 * @returns 
 */
export function executeCommand(cmd, options = { cwd: cwd(), shell: true }) {
  return new Promise((resolve, reject) => {
    exec(cmd, options, (err, stdout, stderr) => {
      if (err) return reject(err, stderr);
      return resolve(stdout, stderr);
    });
  });
}

export function deleteFiles(filePaths = []) {
  if (!filePaths.length) {
    console.log("filePaths cannot be empty.");
    return;
  }

  console.log("\nDeletion process started...\n");
  filePaths.forEach(filePath => {
    if (existsSync(filePath)) {
      try {
        unlinkSync(filePath);
        const msg = `DELETED: '${filePath}'`;
        console.log(msg);
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
  });
}
