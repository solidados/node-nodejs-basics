import { join } from "node:path";
import { cp } from "node:fs/promises";
import { getDirName } from "../helpers/getDirName.js";
import process from "node:process";
import handleError from "../helpers/handleError.js";
import isPathExists from "../helpers/isPathExists.js";

const copy = async () => {
  const TASK_DATA = {
    source: { dirName: "files" },
    destination: { dirName: "files_copy" },
    errors: {
      isExist: { code: "EEXIST", message: "FS operation failed" },
      noExist: { code: "ENOENT", message: "FS operation failed" },
    },
    copyOptions: {
      recursive: true,
      errorOnExist: true,
      force: false,
    },
  };

  const { source, destination, errors, copyOptions } = TASK_DATA;
  const __dirname = getDirName(import.meta.url);
  const sourcePath = join(__dirname, source.dirName);
  const destinationPath = join(__dirname, destination.dirName);

  try {
    const sourceExist = await isPathExists(sourcePath);
    const destinationExist = await isPathExists(destinationPath);

    !sourceExist && handleError({ code: errors.noExist.code }, errors.noExist);
    destinationExist &&
      handleError({ code: errors.isExist.code }, errors.isExist);

    await cp(sourcePath, destinationPath, copyOptions);
    console.log(
      `>> Success!\nFolder \x1b[34m${source.dirName}\x1b[0m now has its own clone \x1b[34m${destination.dirName}\x1b[0m`,
    );
  } catch (error) {
    handleError(
      error,
      error.code === errors.noExist.code ? errors.noExist : errors.isExist,
    );
  }
};

await copy().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
