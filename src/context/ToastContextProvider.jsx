import React, { useCallback, useState } from "react";
import ToastContext from "./ToastContext";
import Toast from "../components/Toast/Toast";

const ToastContextProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type) => {
    setToast({ message, type });
  }, []);

  const hideToast = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {toast && (
          <Toast message={toast.message} type={toast.type} onClose={hideToast} />
        )}
        {children}
    </ToastContext.Provider>
  );
};

export default ToastContextProvider;
