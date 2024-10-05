import { access } from "node:fs/promises";

const isPathExists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

export default isPathExists;
