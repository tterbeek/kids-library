// src/msalConfig.js
import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "a71da847-7471-4d52-8bdd-de69f22d1c9e",
    authority: "https://login.microsoftonline.com/c0a7ac20-aa6a-43ff-b346-a5b54575705c",
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Warning,
    },
  },
};

export const loginRequest = {
  scopes: ["Files.Read", "Sites.Read.All"],
};
