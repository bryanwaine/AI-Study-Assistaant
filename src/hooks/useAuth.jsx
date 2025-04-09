import { useContext } from "react";
import AuthContext from "../context/AuthContext";

// custom hook to access auth context
const useAuth = () => useContext(AuthContext);

export default useAuth;
