// src/App.js
import React from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { msalConfig } from "./msalConfig";

import HomePage from "./pages/HomePage";
import BookPage from "./pages/BookPage";

const pca = new PublicClientApplication(msalConfig);

function App() {
  return (
    <MsalProvider instance={pca}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book/:id" element={<BookPage />} />
        </Routes>
      </Router>
    </MsalProvider>
  );
}

export default App;
