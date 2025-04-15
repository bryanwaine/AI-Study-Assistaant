import { getAuth, validatePassword } from "firebase/auth";

const passwordValidation = async (password) => {
  const errors = [];
  let isPasswordValid = false;
  const status = await validatePassword(getAuth(), password);
  if (status.isValid) {
    isPasswordValid = true;
    
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
  
  return { isPasswordValid, errors };
};

export default passwordValidation;
