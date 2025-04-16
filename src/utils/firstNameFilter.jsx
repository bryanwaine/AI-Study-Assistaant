const firstNameFilter = (name) => {
    if (!name) return "";
    const firstName = name.trim().split(" ")[0];

    return firstName[0].toUpperCase() + firstName.slice(1).toLowerCase();
};

export default firstNameFilter;