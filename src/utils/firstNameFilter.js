/**
 * Given a full name, return the first name with the first letter capitalized and the rest lowercased.
 * If the name is empty or undefined, return an empty string.
 * @param {string} name - Full name
 * @returns {string} - First name
 */
const firstNameFilter = (name) => {
    if (!name) return "";
    const firstName = name.trim().split(" ")[0];

    return firstName[0].toUpperCase() + firstName.slice(1).toLowerCase();
};

export default firstNameFilter;