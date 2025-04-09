import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "./index.css";
import App from "./App";
import ContextLayout from "./components/ContextLayout";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ContextLayout>
      <App />
    </ContextLayout>
  </StrictMode>
);
