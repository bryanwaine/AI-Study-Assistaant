import { getAuth, validatePassword } from "firebase/auth";

const passwordValidation = async (password) => {
  const errors = [];
  let isValid = false;
  const status = await validatePassword(getAuth(), password);
  if (status.isValid) {
    isValid = true;
    
  }

  if (!status.containsLowercaseLetter) {
    errors.push("Password must include at least one lowercase letter.");
  }

  if (!status.containsUppercaseLetter) {
    errors.push("Password must include at least one uppercase letter.");
  }

  if (!status.containsNumber) {
    errors.push("Password must include at least one number.");
  }

  if (!status.containsNonAlphanumericCharacter) {
    errors.push("Password must include at least one special character.");
  }

  if (!status.meetsMinPasswordLength) {
    errors.push("Password must be at least 8 characters long.");
  }
    // console.log(status);
    console.log(errors);
  return { isValid, errors };
};

export default passwordValidation;
