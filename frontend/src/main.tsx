import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { UserSessionProvider } from "./context/user";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserSessionProvider>
      <App />
    </UserSessionProvider>
  </StrictMode>,
);
