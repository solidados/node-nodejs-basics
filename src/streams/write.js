import { access } from "node:fs/promises";
import { basename, join } from "node:path";
import { createWriteStream } from "node:fs";
import process from "node:process";
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
    lineInterface: {
      input: process.stdin,
      output: process.stdout,
      prompt: "> ",
    },
  };

  const { destination, errors, options, lineInterface } = TASK_DATA;
  const __dirname = getDirName(import.meta.url);
  const pathToFile = join(__dirname, destination.dirName, destination.fileName);
  const fileNameWithExt = basename(pathToFile);

  try {
    await access(pathToFile);
  } catch (_error) {
    handleError({ code: "ENOENT" }, errors.noExist);
    return;
  }

  const writeStream = createWriteStream(pathToFile, options);
  const rl = readline.createInterface(Object.assign(lineInterface));

  let isClosed = false;

  rl.prompt();
  console.log(
    "Start typing.\nType \x1b[7m.exit\x1b[0m or Press \x1b[7mCTRL+D\x1b[0m to complete: ",
  );

  const handleClose = async () => {
    if (isClosed) return;
    isClosed = true;
    console.log(
      `\n\x1b[32mWrite to file\x1b[0m \x1b[34m${fileNameWithExt}\x1b[0m \x1b[32mcompleted successfully.\x1b[0m`,
    );
    await writeStream.end();
    await rl.close();
  };

  rl.on("line", async (line) => {
    if (line.trim() === ".exit") {
      await handleClose();
      return;
    }
    writeStream.write(`${line}\n`);
    await rl.prompt();
  });

  rl.on("close", handleClose);

  process.on("SIGINT", handleClose);
};

await write().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
