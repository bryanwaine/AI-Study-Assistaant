import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import AuthContextProvider from "./context/AuthContexProvider";
import ToastContextProvider from "./context/ToastContextProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <ToastContextProvider>
        <App />
      </ToastContextProvider>
    </AuthContextProvider>
  </StrictMode>
);
