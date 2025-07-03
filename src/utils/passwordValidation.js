import { getAuth, validatePassword } from "firebase/auth";

/**
 * Validates a password against specific criteria and returns the validation result.
 *
 * This function checks if the password contains at least one lowercase letter, 
 * one uppercase letter, one number, one special character, and meets a minimum 
 * length of 8 characters. It utilizes Firebase's validatePassword method for 
 * initial validation.
 *
 * @param {string} password - The password to be validated.
 * @returns {Promise<Object>} - An object containing a boolean `isPasswordValid` 
 * indicating if the password is valid, and an array `errors` listing validation 
 * error messages if any criteria are not met.
 */
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
