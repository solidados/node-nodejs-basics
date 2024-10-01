import { access } from "node:fs/promises";

const pathExists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

export default pathExists;
