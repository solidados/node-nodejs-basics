import { unlink as deleteFile } from "fs/promises";
import { basename, join } from "node:path";
import { getDirName } from "../helpers/getDirName.js";
import handleError from "../helpers/handleError.js";
import pathExists from "../helpers/pathExists.js";

const remove = async () => {
  const TASK_DATA = {
    destination: { dirName: "files", fileName: "fileToRemove.txt" },
    errors: {
      noExist: { code: "ENOENT", message: "FS operation failed" },
    },
  };

  const { destination, errors } = TASK_DATA;

  const __dirname = getDirName(import.meta.url);
  const destinationPath = join(
    __dirname,
    destination.dirName,
    destination.fileName,
  );
  const dstFileNameWithExt = basename(destinationPath);

  try {
    const destinationExist = await pathExists(destinationPath);
    !destinationExist &&
      handleError(new Error(errors.noExist.message), errors.noExist);

    await deleteFile(destinationPath);
    console.log(
      `>> Success!\nFile \x1b[36m${dstFileNameWithExt}\x1b[0m was removed`,
    );
  } catch (error) {
    if (error.message === errors.noExist.message) {
      handleError(error, errors.noExist);
    } else {
      handleError(error, { code: "UNKNOWN", message: "FS operation failed" });
    }
  }
};

await remove().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
