/**
 * Returns true if the given email is valid, false otherwise.
 *
 * The email is considered valid if it matches the following regex:
 * /\S+@\S+\.\S+/
 *
 * This is a very basic validation and does not cover all the
 * possible valid email formats.
 *
 * @param {string} email
 * @returns {boolean}
 */
const emailValidation = (email) => {
  let isValid = false;
  if (/\S+@\S+\.\S+/.test(email.trim())) {
    isValid = true;
  }

  return isValid;
};

export default emailValidation;
