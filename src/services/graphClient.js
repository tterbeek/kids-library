// src/services/graphClient.js
import axios from "axios";

let accessToken = null;

// In-memory cache so we never call Graph repeatedly
let videoCache = null;

// Store timestamp to avoid accidental re-fetch within same session
let lastFetchTime = 0;

export const setAccessToken = (token) => {
  accessToken = token;
};

// ====== IMPORTANT: Update these if needed ======
const SITE_ID =
  "sggbaz.sharepoint.com,cc6afe9a-fba8-4663-9a5a-678a1a064291,6a29c6d9-994c-4c77-b50c-7da87ee37fdc";
const DRIVE_ID =
  "b!mv5qzKj7Y0aaWmeKGgZCkdnGKWpMmXdMtQx9qH7jf9yUlii_VBwVTL8OnuuSn9PH";
// ===============================================

/**
 * List all videos & images inside the SharePoint library.
 * Includes:
 *  - caching
 *  - retry logic for 429 throttling
 *  - minimal Graph calls
 */
export const listVideos = async () => {
  if (!accessToken) throw new Error("No access token set");

  // If we have a cache AND last fetch < 10 minutes ago → use cache
  if (videoCache && Date.now() - lastFetchTime < 10 * 60 * 1000) {
    return videoCache;
  }

  const url = `https://graph.microsoft.com/v1.0/sites/${SITE_ID}/drives/${DRIVE_ID}/root/children?expand=listItem($expand=fields)`;

  // Retry up to 3 times on 429 errors
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      videoCache = response.data.value;
      lastFetchTime = Date.now();

      return videoCache;
    } catch (err) {
      if (err.response?.status === 429) {
        // Exponential backoff
        await new Promise((res) => setTimeout(res, 500 * (attempt + 1)));
      } else {
        throw err;
      }
    }
  }

  throw new Error("Graph API throttle: too many requests");
};

export const getFileDownloadUrl = async (itemId) => {
  if (!accessToken) throw new Error("No access token set");

  const url = `https://graph.microsoft.com/v1.0/sites/${SITE_ID}/drives/${DRIVE_ID}/items/${itemId}/content`;

  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    maxRedirects: 0,
    validateStatus: (status) => status >= 200 && status < 400,
  });

  return response.request.responseURL;
};
