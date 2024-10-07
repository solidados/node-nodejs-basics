import process from "node:process";

const args = process.argv.slice(2);
process.on("message", (message) => console.log(message.greeting));
console.log(`Total number of arguments is: \x1b[36m${args.length}\x1b[0m`);
console.log(`Arguments: \x1b[32m${JSON.stringify(args)}\x1b[0m`);

const echoInput = (chunk) => {
  const chunkStringified = chunk.toString();
  if (chunkStringified.includes("CLOSE")) process.exit(0);
  process.stdout.write(
    `Received from master process: \x1b[33m${chunk.toString()}\x1b[0m\n`,
  );
};

process.stdin.on("data", echoInput);
