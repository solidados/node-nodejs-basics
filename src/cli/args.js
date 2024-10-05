import process from "node:process";

const parseArgs = () => {
  const argsArr = process.argv.slice(2);

  if (argsArr.length % 2 !== 0) {
    console.error("CLI operation failed: Odd number of arguments");
    process.exit(1);
  }

  const result = argsArr
    .filter((_, index) => !(index % 2))
    .map((arg, index) => {
      const value = argsArr[index * 2 + 1];
      const propName = arg.replace("--", "");

      return `\x1b[32m${propName}\x1b[0m is \x1b[32m${value}\x1b[0m`;
    })
    .join(", ");

  console.log(result);
};

parseArgs();
