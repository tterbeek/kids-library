export const msalConfig = {
  auth: {
    clientId: "a71da847-7471-4d52-8bdd-de69f22d1c9e",
    authority: "https://login.microsoftonline.com/c0a7ac20-aa6a-43ff-b346-a5b54575705c",
    redirectUri: window.location.origin + "/", 
    navigateToLoginRequestUrl: true,
  },

  cache: {
    cacheLocation: "localStorage",        // REQUIRED for iOS Safari
    storeAuthStateInCookie: true,         // REQUIRED for Safari redirect stability
  },
};
