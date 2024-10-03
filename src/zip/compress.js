import * as constants from "node:constants";
import { createReadStream, createWriteStream } from "node:fs";
import { access } from "node:fs/promises";
import { basename, join } from "node:path";
import { pipeline } from "node:stream/promises";
import { createGzip } from "node:zlib";

import { getDirName } from "../helpers/getDirName.js";
import handleError from "../helpers/handleError.js";

const compress = async () => {
  const TASK_DATA = {
    source: { dirName: "files", fileName: "fileToCompress.txt" },
    destination: { dirname: "files", fileName: "archive.gz" },
    errors: {
      noExist: { code: "ENOENT", message: "Source file does not exist" },
    },
  };

  const { source, destination, errors } = TASK_DATA;
  const __dirname = getDirName(import.meta.url);
  const pathToSrcFile = join(__dirname, source.dirName, source.fileName);
  const pathToDestFile = join(
    __dirname,
    destination.dirname,
    destination.fileName,
  );
  const fileNameWithExt = basename(pathToSrcFile);

  try {
    await access(pathToSrcFile, constants.F_OK);

    const gzip = createGzip();
    const readStream = createReadStream(pathToSrcFile);
    const writeStream = createWriteStream(pathToDestFile);

    await pipeline(readStream, gzip, writeStream);
    console.log(
      `\x1b[32mFile\x1b[0m \x1b[34m${fileNameWithExt}\x1b[0m \x1b[32mcompressed successfully.\x1b[0m`,
    );
  } catch (error) {
    if (error.code === "ENOENT") {
      handleError(error, errors.noExist);
    } else {
      handleError(error, "An error occurred during compression.");
    }
  }
};

await compress().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
