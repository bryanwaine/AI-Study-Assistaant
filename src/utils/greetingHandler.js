/**
 * Generates a greeting message based on the current time and provided name.
 * Returns "Good Morning" if the current hour is before 12 PM,
 * "Good Afternoon" if before 6 PM, and "Good Evening" otherwise.
 * 
 * @param {string} name - The name of the person to greet.
 * @returns {string} - A greeting message with a corresponding emoji.
 */
const handleGreeting = (name) => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return `Good Morning, ${name} 🌤️`;
  } else if (hour < 18) {
    return `Good Afternoon, ${name} 🌞`;
  } else {
    return `Good Evening, ${name} 🌛`;
  }
};

export default handleGreeting;
