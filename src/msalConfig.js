// msalConfig.js
export const msalConfig = {
  auth: {
    clientId: "a71da847-7471-4d52-8bdd-de69f22d1c9e",
    authority:
      "https://login.microsoftonline.com/c0a7ac20-aa6a-43ff-b346-a5b54575705c",
    redirectUri: window.location.origin + "/", // works for localhost + Netlify
  },

  cache: {
    // 🔥 IMPORTANT FIX:
    // Use sessionStorage so clearing localStorage won't break MSAL on Edge/Linux
    cacheLocation: "sessionStorage",

    // Keep this OFF for web apps unless necessary
    storeAuthStateInCookie: true,
  },
};
