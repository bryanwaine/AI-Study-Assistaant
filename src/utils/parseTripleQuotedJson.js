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