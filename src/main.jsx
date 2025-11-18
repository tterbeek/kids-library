import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./msalConfig";

const msalInstance = new PublicClientApplication(msalConfig);

// --- SAFE INITIALIZATION FIX ---
async function start() {
  try {
    await msalInstance.initialize();
    await msalInstance.handleRedirectPromise();
  } catch (err) {
    console.error("MSAL failed during initialize or redirect:", err);
  }

  ReactDOM.createRoot(document.getElementById("root")).render(
    <MsalProvider instance={msalInstance}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MsalProvider>
  );
}

start();
