import { join } from "node:path";
import { createReadStream } from "node:fs";
import { createHash } from "node:crypto";
import process from "node:process";

import { getDirName } from "../helpers/getDirName.js";
import handleError from "../helpers/handleError.js";

const calculateHash = async () => {
  const __dirname = getDirName(import.meta.url);
  const pathToFile = join(__dirname, "files", "fileToCalculateHashFor.txt");
  const errors = {
    noExist: { code: "ENOENT", message: "FS operation failed" },
  };

  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(pathToFile);

    stream.on("data", (chunk) => hash.update(chunk));

    stream.on("end", () => {
      const hex = hash.digest("hex");
      console.log(`SHA256 Hash: \x1b[32m${hex}\x1b[0m`);
      resolve();
    });

    stream.on("error", (error) => {
      try {
        handleError(error, errors.noExist);
      } catch (error) {
        reject(error);
      }
    });
  });
};

await calculateHash().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
