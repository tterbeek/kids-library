// src/components/BookCard.js
import React from "react";

export default function BookCard({ title, coverId, onClick }) {
  const coverUrl = coverId
    ? `https://graph.microsoft.com/v1.0/me/drive/items/${coverId}/content`
    : "https://via.placeholder.com/200x250?text=No+Cover";

  return (
    <div
      onClick={onClick}
      style={{
        border: "3px solid #333",
        borderRadius: "10px",
        cursor: "pointer",
        textAlign: "center",
        padding: "10px",
        background: "#f9f9f9"
      }}
    >
      <img
        src={coverUrl}
        alt={title}
        style={{ width: "200px", height: "250px", objectFit: "cover" }}
      />
      <div style={{ marginTop: "10px", fontSize: "20px" }}>{title}</div>
    </div>
  );
}
