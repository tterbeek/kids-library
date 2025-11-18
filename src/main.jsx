import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./msalConfig";

const msalInstance = new PublicClientApplication(msalConfig);

// ------------------------------------------------------------
// ⭐ IMPORTANT: Handle MSAL redirect BEFORE React renders
// This fixes iPad, PWA, Safari, and popup-blocked login issues.
// ------------------------------------------------------------
msalInstance.handleRedirectPromise().then((result) => {
  if (result && result.account) {
    msalInstance.setActiveAccount(result.account);
  }
});

msalInstance.handleRedirectPromise().then(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <MsalProvider instance={msalInstance}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MsalProvider>
  );
});
