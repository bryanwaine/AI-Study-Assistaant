export function handleFirebaseError(error) {
    if (!error || !error.code) {
      return {
        code: null,
        message: "An unexpected error occurred. Please try again.",
        isFirebaseError: false,
      };
    }
  
    let message;
  
    switch (error.code) {
      // Auth Errors
      case "auth/invalid-credential":
        message = "The email address is not valid.";
        break;
      case "auth/user-disabled":
        message = "This user account has been disabled.";
        break;
      case "auth/user-not-found":
        message = "No account found with this email.";
        break;
      case "auth/wrong-password":
        message = "Incorrect password. Please try again.";
        break;
      case "auth/email-already-in-use":
        message = "This email is already in use.";
        break;
      case "auth/weak-password":
        message = "Password is too weak. Please choose a stronger one.";
        break;
      case "auth/missing-password":
        message = "Please enter your password.";
        break;
      case "auth/missing-email":
        message = "Please enter your email address.";
        break;
      case "auth/too-many-requests":
        message = "Too many attempts. Try again later.";
        break;
      case "auth/network-request-failed":
        message = "Network error. Please check your connection.";
        break;
  
      // Firestore / Database Errors
      case "permission-denied":
        message = "You don’t have permission to perform this action.";
        break;
      case "unavailable":
        message = "The service is temporarily unavailable. Try again shortly.";
        break;
      case "deadline-exceeded":
        message = "Request timed out. Please try again.";
        break;
  
      // Default
      default:
        message = error.message || "An unknown Firebase error occurred.";
        break;
    }
  
    return {
      code: error.code,
      message,
      isFirebaseError: true,
    };
  }
  
  export default handleFirebaseError;  