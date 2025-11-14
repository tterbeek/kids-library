// src/components/BookGrid.js
import React, { useEffect, useState } from "react";
import { listVideos } from "../services/graphClient";
import BookCard from "./BookCard";
import { useNavigate } from "react-router-dom";

export default function BookGrid() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const files = await listVideos();

      // Map files into books
      const books = files
        .filter((f) => f.name.endsWith(".mp4"))
        .map((vid) => {
          const baseName = vid.name.replace(".mp4", "");
          const cover = files.find((f) => f.name === baseName + ".jpg");

          return {
            id: vid.id,
            title: baseName,
            coverId: cover?.id || null,
          };
        });

      setItems(books);
    };

    load();
  }, []);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      gap: "20px",
      padding: "20px"
    }}>
      {items.map((item) => (
        <BookCard
          key={item.id}
          title={item.title}
          coverId={item.coverId}
          onClick={() => navigate(`/book/${item.id}`)}
        />
      ))}
    </div>
  );
}
