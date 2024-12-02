import { GoogleGenerativeAI } from "@google/generative-ai";
import ChatPrompt from "./chatprompt";

let genAI = null;
let model = null;

function getInitialPrompt(mode, subtitles, language, referenceTimestamp, referenceDescription, videoId) {
    const initialPrompt = {
        chat: ChatPrompt(subtitles, videoId, referenceTimestamp, referenceDescription),

        summary: `You are an AI assistant that summarizes YouTube videos based on subtitles. You will receive subtitles as a JSON object and a target language.  Your summary should always be well-structured and detailed, utilizing headings, subheadings, bullet points, and numbered lists appropriately. Do not include the video ID in your responses.

        **Subtitles:**

        \`\`\`json
        ${JSON.stringify(subtitles)}
        \`\`\`

        **Language:** ${language}

        **Instructions:**

        * Analyze the subtitles word by word.
        * Generate a detailed summary of the entire video, including key points, main ideas, examples, and supporting details, presented in a structured format.
        * Use headings (e.g., \`# Main Topic\`, \`## Subtopic\`) and lists (e.g., \`* Item\`, \`1. Item\`) to organize the summary effectively.
        * Accurately reflect the video's tone, context, and intent.
        * Present the summary in Markdown format.
        * Be comprehensive.
        * Respond only in the specified language.  Never include the video ID in your response.`
    };
    return initialPrompt[mode];
}

function processHistory(history) {
    return history.flatMap((message, index) => {
        const role = index % 2 === 0 ? "user" : "model";
        return [{ role, parts: [{ text: message }] }];
    });
}


export async function getGeminiResponse(prompt, history, subtitles, language, videoId, referenceTimestamp, referenceDescription, setSummary, setMessages, GeminiApiKey) {
    const processedHistory = processHistory(history);
    const initialPrompt = getInitialPrompt(prompt.mode, subtitles, language, referenceTimestamp, referenceDescription, videoId);

    if (!genAI || !model) {
        genAI = new GoogleGenerativeAI(GeminiApiKey);
        model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }



    const chat = model.startChat({
        history: [
            { role: "user", parts: [{ text: initialPrompt }] },
            ...processedHistory,
        ],
    });


    let result = await chat.sendMessageStream(prompt.text);
    for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
            if (setSummary) {
                setSummary((prev) => prev + chunkText);
            } else {
                if (setMessages) {
                    setMessages((prevMessages) => {
                        const updatedMessages = [...prevMessages];
                        updatedMessages[updatedMessages.length - 1] += chunkText;
                        return updatedMessages;
                    });
                }
            }
        }
    }
}