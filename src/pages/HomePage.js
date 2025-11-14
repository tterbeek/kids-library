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
    const authenticate = async () => {
      // 1) If no accounts, user is not logged in → popup login
useEffect(() => {
  const run = async () => {
    await instance.initialize();   // <-- IMPORTANT FIX

    if (accounts.length === 0) {
      console.log("No accounts, running loginPopup...");
      await instance.loginPopup({
        scopes: ["User.Read", "Files.Read", "Files.Read.All", "Sites.Read.All"]
      });
      return;
    }

    try {
      console.log("Trying silent token...");
      const result = await instance.acquireTokenSilent({
        scopes: ["User.Read", "Files.Read", "Files.Read.All", "Sites.Read.All"],
        account: accounts[0]
      });

      console.log("Token scopes:", result.scopes);
      setAccessToken(result.accessToken);
      setTokenLoaded(true);
    } catch (err) {
      console.error("Silent token failed:", err);
      const result = await instance.loginPopup({
        scopes: ["User.Read", "Files.Read", "Files.Read.All", "Sites.Read.All"]
      });
      setAccessToken(result.accessToken);
      setTokenLoaded(true);
    }
  };

  run().catch(console.error);
}, [accounts, instance]);


      // 2) We have an account → try silent token
      try {
        console.log("Trying silent token…");
        const result = await instance.acquireTokenSilent({
          scopes: [
            "User.Read",
            "Files.Read",
            "Files.Read.All",
            "Sites.Read.All"
          ],
          account: accounts[0],
        });

        console.log("Token scopes:", result.scopes);
        setAccessToken(result.accessToken);
        setTokenLoaded(true);
      } catch (err) {
        console.error("Silent token failed:", err);

        // 3) If silent fails → fallback login
        const result = await instance.loginPopup({
          scopes: [
            "User.Read",
            "Files.Read",
            "Files.Read.All",
            "Sites.Read.All"
          ],
        });

        console.log("Token scopes after popup:", result.scopes);
        setAccessToken(result.accessToken);
        setTokenLoaded(true);
      }
    };

    authenticate();
  }, [accounts, instance]);

  if (!tokenLoaded) {
    return <div>Loading authentication...</div>;
  }

  return (
    <>
      <Header />
      <BookGrid />
    </>
  );
}
