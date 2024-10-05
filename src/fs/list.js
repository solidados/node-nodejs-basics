import { join } from "node:path";
import { readdir } from "fs/promises";
import process from "node:process";
import { getDirName } from "../helpers/getDirName.js";
import handleError from "../helpers/handleError.js";
import isPathExists from "../helpers/isPathExists.js";

const list = async () => {
  const TASK_DATA = {
    destination: { dirName: "files" },
    errors: {
      noExist: { code: "ENOENT", message: "FS operation failed" },
      unknownError: { code: "UNKNOWN", message: "Unknown error occurred" },
    },
    options: {
      encoding: "utf-8",
      withFileTypes: true,
      recursive: true,
    },
  };

  const { destination, errors, options } = TASK_DATA;
  const __dirname = getDirName(import.meta.url);
  const destinationPath = join(__dirname, destination.dirName);

  try {
    const destinationExist = await isPathExists(destinationPath);
    !destinationExist &&
      handleError({ code: errors.noExist.code }, errors.noExist);

    const direntArray = await readdir(destinationPath, options);
    const fileNames = direntArray
      .filter((dirent) => dirent.isFile())
      .map((dirent) => dirent.name);

    console.log(
      `>> Success!\nDirectory \x1b[34m${destination.dirName}/\x1b[0m contains:\n \x1b[36m${fileNames.join(",\n ")}\x1b[0m`,
    );
  } catch (error) {
    handleError(
      error,
      error.code === errors.noExist.code ? errors.noExist : errors.unknownError,
    );
  }
};

await list().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
