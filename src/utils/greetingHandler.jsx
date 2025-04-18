const handleGreeting = (name) => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return `Good Morning, ${name}.`;
  } else if (hour < 18) {
    return `Good Afternoon, ${name}.`;
  } else {
    return `Good Evening, ${name}.`;
  }
};

export default handleGreeting;
