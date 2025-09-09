/* global chrome */

import TrainingChromePrompt from "./TrainingChromePrompt";

export async function generateKeywordMap(completeSubtitlesArray, videoId) {
  const cacheKey = `keywords_${videoId}`;
  const cache = await chrome.storage.local.get([cacheKey]);
  let keywordMap = cache[cacheKey] || null;
  if (keywordMap) {
    console.log("found keywords:", keywordMap);
  }

  const sentenceArray = splitSubtitlesIntoSentencesWithOffsets(
    completeSubtitlesArray
  );
  let subtitleChunkArray = groupSentencesIntoChunks(sentenceArray);
  subtitleChunkArray = subtitleChunkArray.map((chunk) => JSON.stringify(chunk));
  console.log(subtitleChunkArray);

  if (!keywordMap) {
    console.log("Generate keywords");
    const prompt =
      "Return the comma-separated keywords you generated earlier. Do not include any additional explanations or text, just the keywords themselves.";
    const PromptSessionIdentifierKeywordsArray = await Promise.all(
      subtitleChunkArray.map(async (subtitleChunk) => {
        let keywords = "";
        try {
          const updatedSubtitleChunkPrompt =
            TrainingChromePrompt(subtitleChunk);
          const session = await window?.LanguageModel?.create({
            initialPrompts: [
              {
                role: "system",
                content: updatedSubtitleChunkPrompt,
              },
            ],
          });
          keywords = await session.prompt(prompt);
          session.destroy();
          return keywords && keywords.trim() ? keywords.trim() : null;
        } catch (error) {
          console.log(error, "error in generating keywords");
          return null;
        }
      })
    );

    const hasNullOrEmpty = PromptSessionIdentifierKeywordsArray.some(
      (item) => !item || !item.trim()
    );
    if (hasNullOrEmpty) {
      console.log("Some generated keywords are empty, not storing keywordMap.");
      return { keywordMap: null, subtitleChunkArray };
    }

    keywordMap = {};
    for (let i = 0; i < PromptSessionIdentifierKeywordsArray.length; i++) {
      keywordMap[i] = PromptSessionIdentifierKeywordsArray[i];
    }
    console.log("Store keywordMap:", keywordMap);
    await chrome.storage.local.set({ [cacheKey]: keywordMap });
  }

  return { keywordMap, subtitleChunkArray };
}

/**
 * Decodes HTML entities like &#39;, &amp; etc. to their literal characters.
 * Used to clean up subtitle text. So that the model sees the correct, human-readable sentence
 */
const _htmlDecodeTextarea = document.createElement("textarea");

function decodeHTMLEntities(text) {
  _htmlDecodeTextarea.innerHTML = text;
  let decoded = _htmlDecodeTextarea.value;
  decoded = decoded.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec));
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
  return decoded;
}

/**
 * Splits subtitle lines into sentence-level segments with associated start and end offsets.
 * Falls back to original entries if a sentence is too long (i.e. > maxWordsPerSentence).
 */
function splitSubtitlesIntoSentencesWithOffsets(
  subtitlesArray,
  maxWordsPerSentence = 100
) {
  const decodedEntries = subtitlesArray.map((entry) => ({
    offset: entry.offset,
    text: decodeHTMLEntities(entry.text).trim(),
  }));

  let fullText = "";
  const indexToOffsetMap = [];

  for (const entry of decodedEntries) {
    const startIdx = fullText.length;
    fullText += entry.text + " ";
    const endIdx = fullText.length;
    for (let i = startIdx; i < endIdx; i++) {
      indexToOffsetMap[i] = entry.offset;
    }
  }
  fullText = fullText.trim();

  const URL_TOKEN = "__URL__";
  const protectedText = fullText
    .replace(/https?:\/\/[^\s]+/g, (url) => `${URL_TOKEN}${url}${URL_TOKEN}`)
    .replace(
      /\b\S+@\S+\.\S+\b/g,
      (email) => `${URL_TOKEN}${email}${URL_TOKEN}`
    );

  const sentenceStrings =
    typeof Intl !== "undefined" && Intl.Segmenter
      ? [
          ...new Intl.Segmenter("en", {
            granularity: "sentence",
          }).segment(protectedText),
        ].map(({ segment }) => segment.replaceAll(URL_TOKEN, "").trim())
      : protectedText
          .split(/(?<=[.!?])\s+/)
          .map((s) => s.replaceAll(URL_TOKEN, "").trim());

  const sentenceObjects = [];
  let cursor = 0;
  let containsUltraLongSentence = false;

  for (const sentence of sentenceStrings) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    const start = fullText.indexOf(trimmed, cursor);
    const end = start + trimmed.length;

    const offset = indexToOffsetMap[start];

    const wordCount = trimmed.split(/\s+/).length;
    if (wordCount > maxWordsPerSentence) {
      containsUltraLongSentence = true;
      break;
    }

    sentenceObjects.push({
      text: trimmed,
      offset,
    });

    cursor = end;
  }

  if (containsUltraLongSentence) {
    console.warn(
      "Fallback: ultra-long sentence detected — using original subtitles as sentence units."
    );
    return subtitlesArray.map((entry) => ({
      text: decodeHTMLEntities(entry.text).trim(),
      offset: entry.offset,
    }));
  }

  return sentenceObjects;
}

/**
 * Groups an array of sentence objects into larger chunks, each bounded by maxWordsPerChunk.
 * Maintains relative ordering and keeps track of offset metadata.
 */
function groupSentencesIntoChunks(sentenceObjects, maxWordsPerChunk = 3500) {
  const chunks = [];
  let currentChunk = [];
  let currentWordCount = 0;

  function pushChunk() {
    if (currentChunk.length === 0) return;

    chunks.push({
      subtitles: [...currentChunk], // preserve full sentence info
    });

    currentChunk = [];
    currentWordCount = 0;
  }

  for (const sentence of sentenceObjects) {
    const sentenceWordCount = sentence.text.split(/\s+/).length + 12;

    if (currentWordCount + sentenceWordCount > maxWordsPerChunk) {
      pushChunk();
    }

    currentChunk.push(sentence);
    currentWordCount += sentenceWordCount;
  }

  pushChunk();
  return chunks;
}

export async function generatePromptSession(subtitleChunk) {
  console.log("generatePromptSession");
  const updatedSubtitleChunkPrompt = TrainingChromePrompt(subtitleChunk);
  const session = await window?.LanguageModel?.create({
    initialPrompts: [{ role: "system", content: updatedSubtitleChunkPrompt }],
  });
  return session;
}
