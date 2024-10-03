import { access } from "node:fs/promises";
import { basename, join } from "node:path";
import { createWriteStream } from "node:fs";
import * as readline from "node:readline";

import { getDirName } from "../helpers/getDirName.js";
import handleError from "../helpers/handleError.js";

const write = async () => {
  const TASK_DATA = {
    destination: { dirName: "files", fileName: "fileToWrite.txt" },
    errors: {
      noExist: { code: "ENOENT", message: "FS operation failed" },
    },
    options: { flags: "a+", encoding: "utf-8" },
  };

  const { destination, errors, options } = TASK_DATA;

  const __dirname = getDirName(import.meta.url);
  const pathToFile = join(__dirname, destination.dirName, destination.fileName);
  const fileNameWithExt = basename(pathToFile);

  try {
    await access(pathToFile);
  } catch (error) {
    handleError({ code: "ENOENT" }, errors.noExist);
    return;
  }

  const writeStream = createWriteStream(pathToFile, options);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> ",
  });

  rl.prompt();

  console.log(
    "Start typing.\nType \x1b[7m.exit\x1b[0m or Press \x1b[7mCTRL+D\x1b[0m to complete: ",
  );

  rl.on("line", async (line) => {
    if (line.trim() === ".exit") {
      writeStream.end();
      rl.close();
      return;
    }
    try {
      writeStream.write(`${line}\n`);
    } catch (error) {
      handleError(error, errors.noExist);
    }
    rl.prompt();
  });

  rl.on("close", () => {
    console.log(
      `\n\x1b[32mWrite to file\x1b[0m \x1b[34m${fileNameWithExt}\x1b[0m \x1b[32mcompleted successfully.\x1b[0m`,
    );
    writeStream.end();
  });

  process.on("SIGINT", () => {
    writeStream.end();
    rl.close();
  });
};

await write().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
