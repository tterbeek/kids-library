// src/pages/HomePage.js
import React, { useEffect, useMemo, useState } from "react";
import HomeHeader from "../components/HomeHeader";
import BookGrid from "../components/BookGrid";
import { useMsal } from "@azure/msal-react";
import { setAccessToken, listVideos } from "../services/graphClient";

export default function HomePage({ navigateToBook = () => {}, setBooks = () => {} }) {
  const { instance } = useMsal();

  const [tokenLoaded, setTokenLoaded] = useState(false);
  const [localBooks, setLocalBooks] = useState([]);
  const [selectedDoelgroep, setSelectedDoelgroep] = useState(() => {
    return localStorage.getItem("doelgroep_filter") || "";
  });

  // Persist filter selection
  useEffect(() => {
    localStorage.setItem("doelgroep_filter", selectedDoelgroep);
  }, [selectedDoelgroep]);

  // ----------------------------------------------------
  // 1) Handle Redirect Callback FIRST
  // (Only runs after MS redirects back to your app)
  // ----------------------------------------------------
  useEffect(() => {
    instance
      .handleRedirectPromise()
      .then(async (response) => {
        // If this was a redirect response, extract the token from it
        if (response && response.accessToken) {
          setAccessToken(response.accessToken);
          setTokenLoaded(true);
          return;
        }

        // Otherwise try silent sign-in
        const accounts = instance.getAllAccounts();
        if (accounts.length === 0) {
          // No session at all → start login
          instance.loginRedirect({
            scopes: ["Files.Read.All", "Sites.Read.All"],
          });
          return;
        }

        // Try acquiring token silently
          try {
            const silent = await instance.acquireTokenSilent({
              scopes: ["Files.Read.All", "Sites.Read.All"],
              account: accounts[0],
            });

            setAccessToken(silent.accessToken);
            setTokenLoaded(true);
          } catch (silentError) {
            console.warn("Silent token failed. Doing redirect login again.", silentError);

            instance.loginRedirect({
              scopes: ["Files.Read.All", "Sites.Read.All"],
            });
          }

      })
      .catch((err) => {
        console.error("MSAL redirect error:", err);
        // fallback to redirect login
        instance.loginRedirect({
          scopes: ["Files.Read.All", "Sites.Read.All"],
        });
      });
  }, [instance]);

  // ----------------------------------------------------
  // 2) Load videos when token is ready
  // ----------------------------------------------------
  useEffect(() => {
    if (!tokenLoaded) return;

    const loadVideosOnce = async () => {
      const items = await listVideos();

      const isPublished = (value) => {
        if (typeof value === "string") {
          return value.trim().toLowerCase() === "ja";
        }
        return Boolean(value);
      };

      const videos = items.filter((f) => {
        const isVideo = f.name.toLowerCase().endsWith(".mp4");
        if (!isVideo) return false;

        const publishedValue = f.listItem?.fields?.Gepubliceerd;
        return isPublished(publishedValue);
      });
      const images = items.filter((f) =>
        f.name.match(/\.(jpg|jpeg|png)$/i)
      );

      const books = videos.map((v) => {
        const base = v.name.replace(/\.[^/.]+$/, "");
        const thumb = images.find((i) => i.name.startsWith(base));
        const doelgroepField = v.listItem?.fields?.Doelgroep;
        const doelgroep = Array.isArray(doelgroepField)
          ? doelgroepField
          : doelgroepField
          ? [doelgroepField]
          : [];

        return {
          id: v.id,
          name: base,
          url: v["@microsoft.graph.downloadUrl"] || v.webUrl,
          cover: thumb
            ? thumb["@microsoft.graph.downloadUrl"]
            : "/default-cover.png",
          doelgroep,
          onClick: () => navigateToBook(v.id),
        };
      });

      setLocalBooks(books);
      setBooks(books);
    };

    loadVideosOnce();
  }, [tokenLoaded, navigateToBook, setBooks]);

  // ----------------------------------------------------
  // Memoized doelgroep options & filtered list (must run every render)
  // ----------------------------------------------------
  const doelgroepOptions = useMemo(() => {
    const allValues = localBooks.flatMap((b) => b.doelgroep || []);
    return Array.from(new Set(allValues)).sort();
  }, [localBooks]);

  const filteredBooks = selectedDoelgroep
    ? localBooks.filter((b) => (b.doelgroep || []).includes(selectedDoelgroep))
    : localBooks;

  // ----------------------------------------------------
  // Loading screen
  // ----------------------------------------------------
  if (!tokenLoaded) {
    return (
      <div className="flex items-center justify-center h-screen text-3xl">
        Laden…
      </div>
    );
  }

console.log("MSAL accounts:", instance.getAllAccounts());
console.log("TokenLoaded:", tokenLoaded);


  // ----------------------------------------------------
  // Page
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <HomeHeader
        doelgroepOptions={doelgroepOptions}
        selectedDoelgroep={selectedDoelgroep}
        onSelectDoelgroep={setSelectedDoelgroep}
      />
      <main className="flex-1 overflow-y-auto">
        <BookGrid books={filteredBooks} />
      </main>
    </div>
  );
}
