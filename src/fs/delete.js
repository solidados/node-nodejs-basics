import { unlink as deleteFile } from "fs/promises";
import { basename, join } from "node:path";
import process from "node:process";
import { getDirName } from "../helpers/getDirName.js";
import handleError from "../helpers/handleError.js";
import isPathExists from "../helpers/isPathExists.js";

const remove = async () => {
  const TASK_DATA = {
    destination: { dirName: "files", fileName: "fileToRemove.txt" },
    errors: {
      noExist: { code: "ENOENT", message: "FS operation failed" },
      unknownError: { code: "UNKNOWN", message: "Unknown error occurred" },
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
    const destinationExist = await isPathExists(destinationPath);
    !destinationExist &&
      handleError(new Error(errors.noExist.message), errors.noExist);

    await deleteFile(destinationPath);
    console.log(
      `>> Success!\nFile \x1b[36m${dstFileNameWithExt}\x1b[0m was removed`,
    );
  } catch (error) {
    handleError(
      error,
      error.code === errors.noExist.code ? errors.noExist : errors.unknownError,
    );
  }
};

await remove().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
