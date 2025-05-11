import dayjs from 'dayjs'

const formatFirebaseTimestamp = (timestamp) => {
  if (!timestamp || typeof timestamp.toDate !== "function") {
    return "Invalid date";
  }

  try {
    const date = timestamp.toDate();
    return dayjs(date).format("DD MMMM YYYY, hh:mm A");
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return "Error formatting date";
  }
};

export default formatFirebaseTimestamp;
