// src/components/BookGrid.js
import React from "react";

export default function BookGrid({ books }) {
  const getProgressFor = (id) => {
    const saved = localStorage.getItem("video_progress_" + id);
    return saved ? Number(saved) : 0;
  };

  return (
    <div className="px-6 py-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {books.map((book) => {
        const savedSeconds = getProgressFor(book.id);
        const showBadge = savedSeconds > 5; // only show if actually watched a bit

        return (
          <div
            key={book.id}
            onClick={book.onClick}
            className="relative bg-white rounded-3xl shadow-lg overflow-hidden active:scale-95 transition-transform duration-150 cursor-pointer"
          >
            {/* Cover */}
            <img
              src={book.cover}
              alt={book.name}
              className="w-full h-48 object-cover"
            />

            {/* Verder kijken badge */}
            {showBadge && (
              <div className="absolute top-2 left-2 bg-yellow-400 text-black text-sm font-bold px-3 py-1 rounded-full shadow">
                Verder kijken
              </div>
            )}

            {/* Title */}
            <div className="p-4 text-lg font-semibold truncate">
              {book.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}
