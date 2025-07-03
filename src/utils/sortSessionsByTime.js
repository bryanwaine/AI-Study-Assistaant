/**
 * Sorts an array of session objects by their update time in descending order (newest first).
 * @param {Object[]} sessions - An array of session objects, each with a metadata property containing an updatedAt property.
 * @returns {Object[]} The sorted array of session objects.
 */
const sortSessionsByTime = (sessions) => {
  return sessions.sort((a, b) => {
    const aTimestamp = new Date(a.metadata.updatedAt.toDate());
    const bTimestamp = new Date(b.metadata.updatedAt.toDate());
    return bTimestamp - aTimestamp;
  });
};

export default sortSessionsByTime;
