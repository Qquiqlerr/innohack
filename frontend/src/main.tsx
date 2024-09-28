import "@gravity-ui/uikit/styles/fonts.css";
import "@gravity-ui/uikit/styles/styles.css";

import { ThemeProvider } from "@gravity-ui/uikit";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import store from "./store/store";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme="dark">
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
