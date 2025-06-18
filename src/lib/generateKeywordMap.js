/* global chrome */

import TrainingChromePrompt from './TrainingChromePrompt';

export async function generateKeywordMap(completeSubtitlesArray, videoId) {
    const cacheKey = `keywords_${videoId}`;
    const cache = await chrome.storage.local.get([cacheKey]);
    let keywordMap = cache[cacheKey] || null;
    if (keywordMap) {
        console.log("found keywords:", keywordMap);
    }

    const completeSubtitles = JSON.stringify(completeSubtitlesArray);
    const subtitleChunkArray = [];
    for (let i = 0; i < completeSubtitles.length; i += 9500) {
        subtitleChunkArray.push(completeSubtitles.slice(i, i + 9500));
    }
    console.log(subtitleChunkArray);

    if (!keywordMap) {
        console.log("Generate keywords");
        const prompt = "Return the comma-separated keywords you generated earlier. Do not include any additional explanations or text, just the keywords themselves.";
        console.time("Generate keywords");
        const PromptSessionIdentifierKeywordsArray = await Promise.all(
            subtitleChunkArray.map(async (subtitleChunk) => {
                let keywords = "";
                try {
                    const updatedSubtitleChunkPrompt = TrainingChromePrompt(subtitleChunk);
                    const session = await window?.LanguageModel?.create({
                        initialPrompts: [{ role: "system", content: updatedSubtitleChunkPrompt }]
                    });
                    keywords = await session.prompt(prompt);
                    session.destroy();
                } catch (error) {
                    console.log(error, "error in generating keywords");
                }
                return keywords;
            })
        );
        console.timeEnd("Generate keywords");

        keywordMap = {};
        for (let i = 0; i < PromptSessionIdentifierKeywordsArray.length; i++) {
            keywordMap[i] = PromptSessionIdentifierKeywordsArray[i];
        }
        console.log("Store keywordMap:", keywordMap);
        await chrome.storage.local.set({ [cacheKey]: keywordMap });
    }

    return { keywordMap, subtitleChunkArray };
}

export async function generatePromptSession(subtitleChunk) {
    console.log("generatePromptSession");
    const updatedSubtitleChunkPrompt = TrainingChromePrompt(subtitleChunk);
    const session = await window?.LanguageModel?.create({
        initialPrompts: [{ role: "system", content: updatedSubtitleChunkPrompt }]
    });
    return session;
}
