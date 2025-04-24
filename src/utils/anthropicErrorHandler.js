// utils/anthropicErrorHandler.js

export function handleAnthropicError(error) {
    let statusCode = error?.response?.status || error?.status || null;
    let message = "An unexpected error occurred.";
  
    // Handle known status codes
    switch (statusCode) {
      case 400:
        message = "Invalid request. Please check your prompt or parameters.";
        break;
      case 401:
        message = "Unauthorized. Check your API key or authentication headers.";
        break;
      case 403:
        message = "Forbidden. You might not have access to this model or endpoint.";
        break;
      case 404:
        message = "Endpoint not found. Please verify the API URL.";
        break;
      case 429:
        message = "Rate limit exceeded. Slow down and try again later.";
        break;
      case 500:
        message = "Server error from Anthropic. Please try again in a bit.";
        break;
      case 503:
        message = "Anthropic service is currently unavailable. Try again shortly.";
        break;
      default:
        // If the error response has a message, show it
        if (error?.response?.data?.error?.message) {
          message = error.response.data.error.message;
        } else if (error?.message) {
          message = error.message;
        }
        break;
    }
  
    return {
      status: statusCode,
      message,
      isAnthropicError: true,
    };
  }
  
  export default handleAnthropicError;  