const errorHandler = (error) => {
    if (error.code === "auth/invalid-credential") {
        return "Invalid email or password";
    } else {
        return "Something went wrong, please try again";
    }


};

export default errorHandler;    