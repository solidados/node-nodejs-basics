const handleError = (error, errorProps) => {
  if (error.code === errorProps?.code) {
    throw new Error(errorProps.message);
  }
  throw error;
};

export default handleError;
