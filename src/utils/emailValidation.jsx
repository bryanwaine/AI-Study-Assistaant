const emailValidation = (email) => {
  let isValid = false;
  if (/\S+@\S+\.\S+/.test(email)) {
    isValid = true;
  }

  return isValid;
};

export default emailValidation;
