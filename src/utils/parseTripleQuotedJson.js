  /**
   * Parse a string that contains a triple-quoted JSON string (delimited by '''json and ''')
   * and return the parsed JSON object.
   *
   * @param {string} input - The string to parse.
   * @returns {object} The parsed JSON object.
   * @throws {Error} If the input string does not contain a valid triple-quoted JSON string.
   */
const parseTripleQuotedJson = (input) => {
    // Extract the JSON content between '''json and '''
    const jsonMatch = input.match(/'''json\s*([\s\S]*?)\s*'''/);
    
    if (!jsonMatch || !jsonMatch[1]) {
      throw new Error("Could not find JSON content between '''json and '''");
    }
    
    // Parse the extracted JSON string
    try {
      return JSON.parse(jsonMatch[1]);
    } catch (error) {
      throw new Error(`Invalid JSON format: ${error.message}`);
    }
  }
  
  

  export default parseTripleQuotedJson