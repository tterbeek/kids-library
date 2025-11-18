// src/components/HomeHeader.js
import React from "react";
import { Eraser } from "lucide-react";

export default function HomeHeader() {
  const handleResetProgress = () => {
    if (
      window.confirm(
        "Weet je zeker dat je ALLE kijkvoortgang wilt wissen?"
      )
    ) {
      // Clear only our own video progress keys
      Object.keys(localStorage)
        .filter((k) => k.startsWith("video_progress_"))
        .forEach((k) => localStorage.removeItem(k));

      alert("Alle kijkvoortgang is gewist!");

      // 🔥 Simple, reliable: restart app state
      window.location.reload();
    }
  };

  return (
    <div className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-md z-20">
      <h1 className="text-3xl font-bold text-black">Kinderbibliotheek</h1>

      <button
        onClick={handleResetProgress}
        className="bg-white p-3 rounded-full shadow active:scale-95"
        title="Maak alle kijkvoortgang leeg"
      >
        <Eraser className="h-7 w-7 text-gray-700" strokeWidth={2.5} />
      </button>
    </div>
  );
}
