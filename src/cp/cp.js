import { spawn } from "node:child_process";
import { join } from "node:path";
import process from "node:process";
import { getDirName } from "../helpers/getDirName.js";

const spawnChildProcess = async (args) => {
  const __dirname = getDirName(import.meta.url);
  const pathToScript = join(__dirname, "files", "script.js");
  const errors = {
    processError: {},
  };

  const childProcess = spawn("node", [pathToScript, ...args], {
    stdio: ["pipe", "pipe", "inherit", "ipc"],
  });

  childProcess.send({ greeting: "Hello! Send me some nice words bellow: " });

  process.stdin.pipe(childProcess.stdin);
  childProcess.stdout.pipe(process.stdout);
  childProcess.on("exit", (exitCode) => {
    if (exitCode !== 0) {
      console.log(`Child process exit with code \x1b[31m${exitCode}\x1b[0m`);
    } else {
      console.log(`\x1b[33mChild process completed successfully\x1b[0m`);
    }
  });
};

// Put your arguments in function call to test this functionality
await spawnChildProcess([
  "--experimental-permission",
  "--allow-fs-read=*",
]).catch((error) => {
  console.error(error.message);
  process.exit(1);
});
