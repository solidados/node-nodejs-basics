import { basename, join } from "node:path";
import { rename as renameFile } from "node:fs/promises";
import process from "node:process";
import { getDirName } from "../helpers/getDirName.js";
import handleError from "../helpers/handleError.js";
import isPathExists from "../helpers/isPathExists.js";

const rename = async () => {
  const TASK_DATA = {
    source: { dirName: "files", fileName: "wrongFilename.txt" },
    destination: { dirName: "files", fileName: "properFilename.md" },
    errors: {
      noExist: { code: "ENOENT", message: "FS operation failed" },
      isExist: { code: "EEXIST", message: "FS operation failed" },
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
    const sourceExists = await isPathExists(sourcePath);
    const destinationExists = await isPathExists(destinationPath);

    !sourceExists && handleError({ code: errors.noExist.code }, errors.noExist);
    destinationExists &&
      handleError({ code: errors.isExist.code }, errors.isExist);

    await renameFile(sourcePath, destinationPath);
    console.log(
      `>> Success!\nFile \x1b[36m${srcFileNameWithExt}\x1b[0m was renamed to \x1b[36m${dstFileNameWithExt}\x1b[0m`,
    );
  } catch (error) {
    handleError(
      error,
      error.code === errors.noExist.code ? errors.noExist : errors.isExist,
    );
  }
};

await rename().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
