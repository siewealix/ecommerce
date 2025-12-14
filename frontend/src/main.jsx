// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./context/UserContext.jsx";
import { PanierProvider } from "./context/PanierContext.jsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <PanierProvider>
          <App />
        </PanierProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
