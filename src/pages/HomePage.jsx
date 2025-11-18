// src/pages/HomePage.js
import React, { useEffect, useState } from "react";
import HomeHeader from "../components/HomeHeader";
import BookGrid from "../components/BookGrid";
import { useMsal } from "@azure/msal-react";
import { setAccessToken, listVideos } from "../services/graphClient";

export default function HomePage({ navigateToBook = () => {}, setBooks = () => {} }) {
  const { instance, accounts } = useMsal();

  const [tokenLoaded, setTokenLoaded] = useState(false);
  const [localBooks, setLocalBooks] = useState([]);

  // 1) Acquire token once
useEffect(() => {
  const loadAuth = async () => {
    // Initialize MSAL properly BEFORE checking accounts
    await instance.initialize();

    const allAccounts = instance.getAllAccounts();

    if (allAccounts.length === 0) {
      // Only perform login if we truly have no session
      await instance.loginPopup({
        scopes: ["Files.Read.All", "Sites.Read.All"],
      });
    }

    const result = await instance.acquireTokenSilent({
      scopes: ["Files.Read.All", "Sites.Read.All"],
      account: instance.getAllAccounts()[0],
    });

    setAccessToken(result.accessToken);
    setTokenLoaded(true);
  };

  loadAuth();
}, [instance]);


  // 2) Load videos once when token is ready
  useEffect(() => {
    if (!tokenLoaded) return;

    const loadVideosOnce = async () => {
      const items = await listVideos();

      const videos = items.filter((f) =>
        f.name.toLowerCase().endsWith(".mp4")
      );
      const images = items.filter((f) =>
        f.name.match(/\.(jpg|jpeg|png)$/i)
      );

      const books = videos.map((v) => {
        const base = v.name.replace(/\.[^/.]+$/, "");
        const thumb = images.find((i) => i.name.startsWith(base));

        return {
          id: v.id,
          name: base,
          url: v["@microsoft.graph.downloadUrl"] || v.webUrl,
          cover: thumb
            ? thumb["@microsoft.graph.downloadUrl"]
            : "/default-cover.png",
          onClick: () => navigateToBook(v.id),
        };
      });

      setLocalBooks(books);
      setBooks(books);
    };

    loadVideosOnce();
  }, [tokenLoaded, navigateToBook, setBooks]);

  if (!tokenLoaded) {
    return (
      <div className="flex items-center justify-center h-screen text-3xl">
        Laden…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <HomeHeader />
      <main className="flex-1 overflow-y-auto">
        <BookGrid books={localBooks} />
      </main>
    </div>
  );
}
