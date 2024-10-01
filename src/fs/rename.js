import { basename, join } from "node:path";
import { rename as renameFile } from "node:fs/promises";
import { getDirName } from "../helpers/getDirName.js";
import handleError from "../helpers/handleError.js";
import pathExists from "../helpers/pathExists.js";

const rename = async () => {
  const TASK_DATA = {
    source: { dirName: "files", fileName: "wrongFilename.txt" },
    destination: { dirName: "files", fileName: "properFilename.md" },
    errors: {
      isExist: { code: "EEXIST", message: "FS operation failed" },
      noExist: { code: "ENOENT", message: "FS operation failed" },
    },
  };

  const { source, destination, errors } = TASK_DATA;

  const __dirname = getDirName(import.meta.url);
  const sourcePath = join(__dirname, source.dirName, source.fileName);
  const destinationPath = join(
    __dirname,
    destination.dirName,
    destination.fileName,
  );
  const srcFileNameWithExt = basename(sourcePath);
  const dstFileNameWithExt = basename(destinationPath);

  try {
    const sourceExists = await pathExists(sourcePath);
    !sourceExists &&
      handleError(new Error(errors.noExist.message), errors.noExist);

    const destinationExists = await pathExists(destinationPath);
    destinationExists &&
      handleError(new Error(errors.isExist.message), errors.isExist);

    await renameFile(sourcePath, destinationPath);
    console.log(
      `>> Success!\nFile \x1b[36m${srcFileNameWithExt}\x1b[0m was renamed to \x1b[36m${dstFileNameWithExt}\x1b[0m`,
    );
  } catch (error) {
    if (error.message === errors.noExist.message) {
      handleError(error, errors.noExist);
    } else if (error.message === errors.isExist.message) {
      handleError(error, errors.isExist);
    } else {
      handleError(error, { code: "UNKNOWN", message: "FS operation failed" });
    }
  }
};

await rename().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
