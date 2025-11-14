// src/services/graphClient.js
import axios from "axios";
import { loginRequest } from "../msalConfig";

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

// ====== IMPORTANT: UPDATE THESE ======
const SITE_ID = "sggbaz.sharepoint.com,cc6afe9a-fba8-4663-9a5a-678a1a064291,6a29c6d9-994c-4c77-b50c-7da87ee37fdc";
const DRIVE_ID = "b!mv5qzKj7Y0aaWmeKGgZCkdnGKWpMmXdMtQx9qH7jf9yUlii_VBwVTL8OnuuSn9PH";
// =====================================

export const listVideos = async () => {
  const url = `https://graph.microsoft.com/v1.0/sites/${SITE_ID}/drives/${DRIVE_ID}/root/children`;

  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  // Only return .mp4 and optional .jpg cover files
  return response.data.value;
};

export const getFileDownloadUrl = async (itemId) => {
  const url = `https://graph.microsoft.com/v1.0/sites/${SITE_ID}/drives/${DRIVE_ID}/items/${itemId}/content`;

  // Graph returns a 302 redirect to a temporary URL
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    maxRedirects: 0,
    validateStatus: (s) => s >= 200 && s < 400,
  });

  return response.request.responseURL;
};
