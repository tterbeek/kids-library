// src/components/VideoPlayer.js
import React, { useEffect, useState } from "react";
import { getFileDownloadUrl } from "../services/graphClient";

export default function VideoPlayer({ itemId }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    const load = async () => {
      const url = await getFileDownloadUrl(itemId);
      setSrc(url);
    };
    load();
  }, [itemId]);

  return (
    <video
      controls
      autoPlay
      style={{ width: "100%", maxHeight: "90vh" }}
      src={src}
    />
  );
}
