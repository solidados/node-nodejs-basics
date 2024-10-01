import { join } from "node:path";
import { readdir } from "fs/promises";
import { getDirName } from "../helpers/getDirName.js";
import handleError from "../helpers/handleError.js";
import pathExists from "../helpers/pathExists.js";

const list = async () => {
  const TASK_DATA = {
    destination: { dirName: "files" },
    errors: {
      noExist: { code: "ENOENT", message: "FS operation failed" },
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
    const destinationExist = await pathExists(destinationPath);
    !destinationExist &&
      handleError(new Error(errors.noExist.message), errors.noExist);

    const direntArr = await readdir(destinationPath, options);

    const fileNames = direntArr
      .filter((dirent) => dirent.isFile())
      .map((dirent) => dirent.name);

    console.log(
      `>> Success!\nDirectory \x1b[34m${destination.dirName}/\x1b[0m contains:\n \x1b[36m${fileNames.join(",\n ")}\x1b[0m`,
    );
  } catch (error) {
    if (error.message === errors.noExist.message) {
      handleError(error, errors.noExist);
    } else {
      handleError(error, { code: "UNKNOWN", message: "FS operation failed" });
    }
  }
};

await list().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
