import "@gravity-ui/uikit/styles/fonts.css";
import "@gravity-ui/uikit/styles/styles.css";

import { ThemeProvider } from "@gravity-ui/uikit";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <StrictMode>
    <ThemeProvider theme="dark">
      <App />
    </ThemeProvider>
  </StrictMode>,
);
