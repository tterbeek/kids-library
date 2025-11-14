// src/pages/HomePage.js
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import BookGrid from "../components/BookGrid";
import { useMsal } from "@azure/msal-react";
import { setAccessToken } from "../services/graphClient";

export default function HomePage() {
  const { instance, accounts } = useMsal();
  const [tokenLoaded, setTokenLoaded] = useState(false);

  console.log("MSAL accounts:", accounts);

  useEffect(() => {
    const getToken = async () => {
      if (accounts.length === 0) return;

      console.log("Requesting token...");

      const result = await instance.acquireTokenSilent({
        scopes: [
          "User.Read",
          "Files.Read",
          "Files.Read.All",
          "Sites.Read.All"
        ],
        account: accounts[0],
      });

      console.log("Access token:", result.accessToken);
      console.log("Token scopes:", result.scopes);

      setAccessToken(result.accessToken);
      setTokenLoaded(true);  // allow BookGrid to load AFTER token is set
    };

    getToken().catch(err => console.error("Token error:", err));
  }, [accounts, instance]);

  if (!tokenLoaded) {
    return <div>Loading authentication…</div>;
  }

  return (
    <>
      <Header />
      <BookGrid />
    </>
  );
}
