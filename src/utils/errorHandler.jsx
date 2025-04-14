const errorHandler = (error) => {
  if (error.code === "auth/invalid-credential") {
    return "Invalid email or password";
  }
  return "Something went wrong";
};

export default errorHandler;
