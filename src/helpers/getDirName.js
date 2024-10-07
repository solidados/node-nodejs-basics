import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const getFileName = fileURLToPath;
export const getDirName = (path) => dirname(getFileName(path));
