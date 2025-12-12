// src/components/HomeHeader.js
import React from "react";
import { Eraser } from "lucide-react";

export default function HomeHeader({
  doelgroepOptions = [],
  selectedDoelgroep = "",
  onSelectDoelgroep = () => {},
}) {
  const handleResetProgress = () => {
    if (
      window.confirm(
        "Weet je zeker dat je ALLE kijkvoortgang wilt wissen?"
      )
    ) {
      // Clear our own video progress + seen flags
      Object.keys(localStorage)
        .filter(
          (k) =>
            k.startsWith("video_progress_") ||
            k.startsWith("video_seen_")
        )
        .forEach((k) => localStorage.removeItem(k));

      alert("Alle kijkvoortgang is gewist!");

      // 🔥 Simple, reliable: restart app state
      window.location.reload();
    }
  };

  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-white shadow-md z-20">
      <h1 className="text-3xl font-bold text-black">Kinderbibliotheek</h1>

      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-700 font-semibold">
          Doelgroep:
        </label>
        <select
          value={selectedDoelgroep}
          onChange={(e) => onSelectDoelgroep(e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Alle</option>
          {doelgroepOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <button
          onClick={handleResetProgress}
          className="bg-white p-3 rounded-full shadow active:scale-95"
          title="Maak alle kijkvoortgang leeg"
        >
          <Eraser className="h-7 w-7 text-gray-700" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
