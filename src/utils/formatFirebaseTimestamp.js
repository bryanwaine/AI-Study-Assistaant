import dayjs from 'dayjs'

/**
 * Given a Firebase Timestamp, formats it into a user-friendly string.
 * If the timestamp is invalid or null, the function returns "Invalid date".
 * If the timestamp cannot be formatted due to an error, the function logs the error
 * and returns "Error formatting date".
 *
 * @param {Firebase.Timestamp} timestamp the timestamp to format
 * @return {string} the formatted date string
 */
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
