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
  };

  const __dirname = getDirName(import.meta.url);
  const sourcePath = join(__dirname, TASK_DATA.source.dirName);
  const destinationPath = join(__dirname, TASK_DATA.destination.dirName);

  try {
    await access(sourcePath);
    try {
      await access(destinationPath);
      throw new Error(TASK_DATA.errors.isExist.message);
    } catch (error) {
      if (error.code !== TASK_DATA.errors.noExist.code) {
        handleError(error, TASK_DATA.errors.noExist);
      }
    }

    await cp(sourcePath, destinationPath, { recursive: true });
    console.log(
      `>> Success!\nFolder \x1b[34m${TASK_DATA.source.dirName}\x1b[0m now has its own clone \x1b[34m${TASK_DATA.destination.dirName}\x1b[0m`,
    );
  } catch (error) {
    if (error.code === TASK_DATA.errors.noExist.code) {
      handleError(error, TASK_DATA.errors.noExist);
    } else if (error.code === TASK_DATA.errors.isExist.code) {
      handleError(error, TASK_DATA.errors.isExist);
    } else {
      console.error(error.message);
    }
  }
};

await copy().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
