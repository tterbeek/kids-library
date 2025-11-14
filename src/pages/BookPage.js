// src/pages/BookPage.js
import React, { useEffect } from "react";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import { useMsal } from "@azure/msal-react";
import { setAccessToken } from "../services/graphClient";

export default function BookPage() {
  const { id } = useParams();
  const { instance, accounts } = useMsal();

  useEffect(() => {
    const loadToken = async () => {
      if (accounts.length === 0) return;

      const result = await instance.acquireTokenSilent({
        scopes: ["Sites.Read.All"],
        account: accounts[0],
      });

      setAccessToken(result.accessToken);
    };

    loadToken();
  }, [accounts, instance]);

  return (
    <>
      <Header />
      <div style={{ padding: 20 }}>
        <VideoPlayer itemId={id} />
      </div>
    </>
  );
}
