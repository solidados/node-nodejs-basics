import { join } from "node:path";
import { cpus } from "node:os";
import { Worker } from "node:worker_threads";
import process from "node:process";

import { getDirName } from "../helpers/getDirName.js";
import isPathExists from "../helpers/isPathExists.js";
import handleError from "../helpers/handleError.js";

const performCalculations = async () => {
  const TASK_DATA = {
    workerFile: { fileName: "worker.js" },
    fibonacciArg: 10,
    errors: {
      noExist: { code: "ENOENT", message: "Path to file does not exist" },
    },
  };

  const { workerFile, fibonacciArg, errors } = TASK_DATA;
  const __dirname = getDirName(import.meta.url);
  const pathToWorkerFile = join(__dirname, workerFile.fileName);
  const numCPUs = cpus().length;

  if (!(await isPathExists(pathToWorkerFile))) handleError(errors.noExist);

  const createWorker = (data) => {
    return new Promise((resolve) => {
      const worker = new Worker(pathToWorkerFile, { workerData: data });
      worker.on("message", (data) => resolve({ status: "resolver", data }));
      worker.on("error", () => resolve({ status: "error", data: null }));
      worker.on("exit", (exitCode) => {
        if (exitCode !== 0) {
          resolve({ status: "error", data: null });
        }
      });
    });
  };

  const workers = Array.from({ length: numCPUs }, (_, i) =>
    createWorker(fibonacciArg + i),
  );

  const settledResults = await Promise.all(workers);
  console.log(settledResults);
};

await performCalculations().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
