import { Transform, pipeline } from "node:stream";
import process from "node:process";
import { EOL } from "node:os";
import handleError from "../helpers/handleError.js";

const transform = async () => {
  console.log(
    "To quit \x1b[7mCTRL+C\x1b[0m or \x1b[7mCTRL+D\x1b[0m\nType, hit Enter and see what will happen: ",
  );

  const reverseTransform = new Transform({
    transform(chunk, _, callback) {
      const reversedData = [...`${chunk}`.trim()].reverse().join("");
      callback(null, `\x1b[32m${reversedData}\x1b[0m${EOL}`);
    },
  });

  try {
    await pipeline(process.stdin, reverseTransform, process.stdout, (error) => {
      if (error) {
        handleError(error, "Text transformation error occurred.");
      }
    });
  } catch (error) {
    handleError(error, "Error occurred during application process.");
  }

  process.on("SIGINT", () => {
    console.log("\n\x1b[31mProcess interrupted by user\x1b[0m");
    process.exit(0);
  });
};

await transform().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
