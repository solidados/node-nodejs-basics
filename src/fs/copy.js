import { join } from "node:path";
import { cp, access } from "node:fs/promises";
import { getDirName } from "../helpers/getDirName.js";
import handleError from "../helpers/handleError.js";

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
    await access(sourcePath);
    try {
      await access(destinationPath);
      throw new Error(errors.isExist.message);
    } catch (error) {
      if (error.code !== errors.noExist.code) {
        handleError(error, errors.noExist);
      }
    }

    await cp(sourcePath, destinationPath, copyOptions);
    console.log(
      `>> Success!\nFolder \x1b[34m${source.dirName}\x1b[0m now has its own clone \x1b[34m${destination.dirName}\x1b[0m`,
    );
  } catch (error) {
    if (error.code === errors.noExist.code) {
      handleError(error, errors.noExist);
    } else if (error.code === errors.isExist.code) {
      handleError(error, errors.isExist);
    } else {
      console.error(error.message);
    }
  }
};

await copy().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
