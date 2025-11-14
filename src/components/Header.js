// src/components/Header.js
import React from "react";
import { useMsal } from "@azure/msal-react";

export default function Header() {
  const { instance, accounts } = useMsal();
  const isLoggedIn = accounts.length > 0;

  const login = () => instance.loginPopup();
  const logout = () => instance.logoutPopup();

  return (
    <div style={{ padding: 20, fontSize: 24 }}>
      <span style={{ fontWeight: "bold" }}>Kinderboeken Bibliotheek</span>

      <span style={{ float: "right" }}>
        {!isLoggedIn ? (
          <button onClick={login}>Sign In</button>
        ) : (
          <button onClick={logout}>Sign Out</button>
        )}
      </span>
    </div>
  );
}
