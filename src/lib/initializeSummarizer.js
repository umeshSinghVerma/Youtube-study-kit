import { getGeminiResponse } from "./getGeminiResponse";

export async function initializeSummarizer(subtitles, setSummary, setLoading, model, outputLanguage,GeminiApiKey) {
    if (model == 'chrome-built-in') {
        let summarizer = null;
        try {
            const canSummarize = await window.ai.summarizer.capabilities();
            if (canSummarize && canSummarize.available !== 'no') {
                if (canSummarize.available === 'readily') {
                    summarizer = await window.ai.summarizer.create();
                    console.log("summarizer activated")
                    let result = '';
                    for (let i = 0; i < subtitles.length; i += 4000) {
                        try {
                            if (i == 0) setLoading(true);
                            const summaryPart = await summarizer.summarize(subtitles.slice(i, i + 4000));
                            result += summaryPart + '\n';
                        } catch (error) {
                            console.error("Error summarizing part", i, error);
                        } finally {
                            if (i == 0) setLoading(false);
                        }
                        setSummary(result);
                    }
                } else {
                    summarizer = await window.ai.summarizer.create();
                    summarizer.addEventListener('downloadprogress', (e) => {
                        console.log(e.loaded, e.total);
                    });
                    await summarizer.ready;
                }
            } else {
                console.log("The summarizer can't be used at all.");
            }
        } catch (error) {
            console.log(error, "Error in initializing summarizer");
        }
        finally {
            if (summarizer != null) summarizer.destroy();
            setLoading(false);
        }
    } else if (model == 'gemini') {
        setSummary("");
        const prompt = {
            mode: "summary",
            text: "You have to generate the detailed summary of the subtitles provided"
        }
        if (GeminiApiKey) {
            await getGeminiResponse(prompt, [], subtitles, outputLanguage, "", "", "", setSummary, null, GeminiApiKey);
        }
    }

}