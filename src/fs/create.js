import { join } from "node:path";
import { writeFile } from "node:fs/promises";
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
  };

  const __dirname = getDirName(import.meta.url);
  const pathToFile = join(__dirname, TASK_DATA.folderName, TASK_DATA.fileName);

  try {
    await writeFile(pathToFile, TASK_DATA.content, {
      flag: "wx",
      encoding: "utf-8",
    });
    console.log(">> File created");
  } catch (error) {
    handleError(error, TASK_DATA.errors.fileExist);
  }
};

await create().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
