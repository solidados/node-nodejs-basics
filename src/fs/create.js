import { join, basename } from "node:path";
import { writeFile } from "node:fs/promises";
import process from "node:process";
import { getDirName } from "../helpers/getDirName.js";
import handleError from "../helpers/handleError.js";

const create = async () => {
  const TASK_DATA = {
    folderName: "files",
    fileName: "fresh.txt",
    content: "I am fresh and young",
    errors: {
      fileExist: { code: "EEXIST", message: "FS operation failed" },
    },
    options: {
      flag: "wx",
      encoding: "utf-8",
    },
  };

  const { folderName, fileName, content, errors, options } = TASK_DATA;
  const __dirname = getDirName(import.meta.url);
  const pathToFile = join(__dirname, folderName, fileName);
  const fileNameWithExt = basename(pathToFile);

  try {
    await writeFile(pathToFile, content, options);
    console.log(`>> File \x1b[36m${fileNameWithExt}\x1b[0m was created`);
  } catch (error) {
    handleError(error, errors.fileExist);
  }
};

await create().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
