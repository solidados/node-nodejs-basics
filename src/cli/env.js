const parseEnv = () => {
  const prefix = "RSS_";
  const envVariables = Object.keys(process.env)
    .filter((key) => key.startsWith(prefix))
    .map((key, value) => `${key}=${value}`)
    .join("; ");
  console.log(envVariables);
};

parseEnv();
