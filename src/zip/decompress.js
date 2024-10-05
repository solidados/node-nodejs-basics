import * as constants from "node:constants";
import { basename, join } from "node:path";
import { createReadStream, createWriteStream } from "node:fs";
import { access } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { createGunzip } from "node:zlib";
import process from "node:process";
import { getDirName } from "../helpers/getDirName.js";
import handleError from "../helpers/handleError.js";

const decompress = async () => {
  const TASK_DATA = {
    source: { dirName: "files", fileName: "archive.gz" },
    destination: { dirname: "files", fileName: "fileToCompress.txt" },
    errors: {
      noExist: { code: "ENOENT", message: "Path to file does not exist" },
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

    const gunzip = createGunzip();
    const readStream = createReadStream(pathToSrcFile);
    const writeStream = createWriteStream(pathToDestFile);

    await pipeline(readStream, gunzip, writeStream);
    console.log(
      `\x1b[32mFile\x1b[0m \x1b[34m${fileNameWithExt}\x1b[0m \x1b[32mdecompressed successfully.\x1b[0m`,
    );
  } catch (error) {
    handleError(
      error,
      error.code === errors.noExist.code
        ? errors.noExist
        : "An error occurred during decompression.",
    );
  }
};

await decompress().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
