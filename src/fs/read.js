import { readFile } from "fs/promises";
import { basename, join } from "node:path";
import { getDirName } from "../helpers/getDirName.js";
import handleError from "../helpers/handleError.js";
import pathExists from "../helpers/pathExists.js";

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
  const destinationPath = join(
    __dirname,
    destination.dirName,
    destination.fileName,
  );
  const fileNameWithExt = basename(destinationPath);

  try {
    const destinationExist = await pathExists(destinationPath);
    !destinationExist &&
      handleError(new Error(errors.noExist.message), errors.noExist);

    const fileInfo = await readFile(destinationPath, options);

    console.log(
      `>> Success!\nFile \x1b[34m${fileNameWithExt}/\x1b[0m contains:\n\x1b[32m${fileInfo}\x1b[0m`,
    );
  } catch (error) {
    if (error.message === errors.noExist.message) {
      handleError(error, errors.noExist);
    } else {
      handleError(error, { code: "UNKNOWN", message: "FS operation failed" });
    }
  }
};

await read().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
