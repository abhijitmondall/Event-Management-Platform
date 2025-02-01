import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/GlobalStyles.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import AuthProvider from "./context/AuthProvider.jsx";
import SocketProvider from "./context/SocketProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SocketProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </SocketProvider>
  </StrictMode>
);
