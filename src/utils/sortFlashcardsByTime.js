  /**
   * Sorts an array of flashcard objects by their creation time in descending order (newest first).
   * @param {Object[]} sessions - An array of flashcard objects, each with a metadata property containing a createdAt property.
   * @returns {Object[]} The sorted array of flashcard objects.
   */
const sortFlashcardsByTime = (sessions) => {
    return sessions.sort((a, b) => {
      const aTimestamp = new Date(a.metadata.createdAt.toDate());
      const bTimestamp = new Date(b.metadata.createdAt.toDate());
      return bTimestamp - aTimestamp;
    });
  };
  
  export default sortFlashcardsByTime;
  