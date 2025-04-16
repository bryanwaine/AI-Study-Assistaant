const emailValidation = (email) => {
  let isValid = false;
  if (/\S+@\S+\.\S+/.test(email.trim())) {
    isValid = true;
  }

  return isValid;
};

export default emailValidation;
