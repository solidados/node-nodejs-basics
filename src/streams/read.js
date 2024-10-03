import { join } from "node:path";
import { createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { EOL } from "node:os";

import { getDirName } from "../helpers/getDirName.js";
import handleError from "../helpers/handleError.js";

const read = async () => {
  const TASK_DATA = {
    destination: { dirName: "files", fileName: "fileToRead.txt" },
    errors: {
      noExist: { code: "ENOENT", message: "FS operation failed" },
    },
    options: {
      encoding: "utf-8",
      flag: "r",
    },
  };

  const { destination, errors, options } = TASK_DATA;

  const __dirname = getDirName(import.meta.url);
  const pathToFile = join(__dirname, destination.dirName, destination.fileName);

  const readStream = createReadStream(pathToFile, options.encoding);

  try {
    await pipeline(readStream, async (source) => {
      for await (const chunk of source) {
        process.stdout.write(
          `>> Succsss!\nFile \x1b[36m${destination.fileName}\x1b[0m content:\n \x1b[32m${chunk}\x1b[0m ${EOL}`,
        );
      }
    });
  } catch (error) {
    handleError(error, errors.noExist);
  }
};

await read().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
