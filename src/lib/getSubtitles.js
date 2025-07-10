/* global chrome */
import { YoutubeTranscript } from "@danielxceron/youtube-transcript";

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h
export async function getSubTitles(videoId, opts = {}) {
  const { forceRefresh = false } = opts;
  const key = `subs_${videoId}`;

  let cached = null;
  if (chrome?.storage?.local) {
    try {
      const { userData = {} } = await chrome.storage.local.get("userData");
      cached = userData?.[videoId]?.[key];

      if (cached && !forceRefresh && Date.now() - cached.ts < CACHE_TTL) {
        // Fresh cache
        return cached.data;
      }
    } catch (err) {
      console.warn("Failed to read from local cache:", err);
    }
  }

  // Fetch a fresh transcript
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    let res = "";
    transcript.forEach((ele) => {
      res += ele.text + " ";
    });

    const data = { text: JSON.stringify(res), subtitles: transcript };
    try {
      const { userData = {} } = await chrome?.storage?.local?.get("userData");
      if (userData[videoId] && typeof userData[videoId] === "object") {
        userData[videoId][key] = { ts: Date.now(), data };
        await chrome?.storage?.local?.set({ userData });
      } else {
        console.info(
          `Could not store transcript, userData[${videoId}] does not exist`
        );
      }
    } catch {
      /* ignore if storage is unavailable */
    }
    return data;
  } catch (error) {
    console.error("Error fetching captions:", error); // Log the full error

    // Fallback to cached (stale) data if available.
    if (cached) {
      console.warn("Using stale transcript due to fetch failure");
      return cached.data;
    }

    throw new Error("Captions cannot be generated for this video.");
  }
}
