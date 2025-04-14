import { useContext } from "react";
import ToastContext from "../context/ToastContext";

// custom hook to access toast context
const useToast = () => useContext(ToastContext);

export default useToast;