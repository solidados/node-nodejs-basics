const parseEnv = () => {
  const prefix = "RSS_";
  const envVariables = Object.keys(process.env)
    .filter((key) => key.startsWith(prefix))
    .map((key, value) => `\x1b[32m${key}=${value}\x1b[0m`)
    .join("; ");
  console.log(envVariables);
};

parseEnv();
