import React, { useContext, useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tab"
import Chat from './ChatComponents/Chat'
import Summary from './Summary'
import { getSubTitles } from '../lib/getSubtitles'
import { LanguageContext } from '../context/LanguageContext'
import { detectLanguage } from '../lib/detectLanguage'
import { initializeSummarizer } from '../lib/initializeSummarizer'
import { SearchContext } from '../context/SearchContext'
import TrainingChromePrompt from '../lib/TrainingChromePrompt'
import PromptSessionIdentifierKeywordsPrompt from '../lib/PromptSessionIdentifierKeywordPrompt'
import MasterSessionPrompt from '../lib/MasterSessionPrompt'

export default function ChatScreen({ currentSearch }) {
    const [videoSubTitles, setVideoSubtitles] = useState({ text: null, subtitiles: null });
    const { convertInputText, outputLanguage } = useContext(LanguageContext);
    const { GeminiApiKey, model, setModel } = useContext(SearchContext);
    const [subTitlesLoading, setSubtitlesLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [summary, setSummary] = useState(null);
    const [chromePromptSessionLoading, setChromePromptSessionLoading] = useState(false);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [promptSessionArray, setPromptSessionArray] = useState([]);
    const [masterPromptSession, setMasterPromptSession] = useState(null);

    async function fetchVideoSubtitiles(videoId) {
        try {
            setSubtitlesLoading(true);
            const subtitles = await getSubTitles(videoId);
            console.log(subtitles);
            if (subtitles && subtitles.text && subtitles.subtitles) {
                setVideoSubtitles({ text: subtitles.text, subtitiles: subtitles.subtitles })
            }
        } catch (error) {
            console.log(error, "error in fetching subtitles")
        } finally {
            setSubtitlesLoading(false);
        }
    }

    async function initiateChromePromptSession(videoSubTitles) {
        try {
            setChromePromptSessionLoading(true);
            const rawCompleteSubtitles = videoSubTitles.subtitiles.map((subtitleObject) => ({
                text: subtitleObject.text,
                offset: parseInt(subtitleObject.offset),
            }));

            const subtitlesLanguage = await detectLanguage(rawCompleteSubtitles[0].text);

            let completeSubtitlesArray = await Promise.all(rawCompleteSubtitles.map(async (subtitleObject) => {
                let translatedText = subtitleObject.text;
                if (subtitlesLanguage !== 'en') {
                    translatedText = await convertInputText(subtitleObject.text, subtitlesLanguage);
                }
                return { text: translatedText, offset: subtitleObject.offset };
            }));

            let completeSubtitles = JSON.stringify(completeSubtitlesArray);
            console.log("these are completeSubtitles", completeSubtitles);


            const subtitleChunkArray = [];
            for (let i = 0; i < completeSubtitles.length; i += 9500) {
                subtitleChunkArray.push(completeSubtitles.slice(i, i + 9500));
            }

            console.log(subtitleChunkArray);

            const promptSessionArray = await Promise.all(subtitleChunkArray.map(async (subtitleChunk) => {
                const updatedSubtitleChunkPrompt = TrainingChromePrompt(subtitleChunk, currentSearch, outputLanguage);
                const session = await window?.ai?.languageModel?.create({
                    systemPrompt: updatedSubtitleChunkPrompt,
                });
                return session;
            }));

            console.log(promptSessionArray, "promptSessionArray");

            setPromptSessionArray(promptSessionArray);

            const PromptSessionIdentifierKeywordsArray = await Promise.all(promptSessionArray.map(async (session) => {
                console.log(session);
                let keywords = "";
                try {
                    const prompt = "Return the comma-separated keywords you generated earlier. Do not include any additional explanations or text, just the keywords themselves.";
                    keywords = await session.prompt(prompt);
                    console.log(keywords);
                } catch (error) {
                    console.log(error, "error in generating keywords");
                }
                return keywords;
            }));

            console.log(PromptSessionIdentifierKeywordsArray, "PromptSessionIdentifierKeywordsArray");

            const keywordMap = {};
            for (let i = 0; i < PromptSessionIdentifierKeywordsArray.length; i++) {
                keywordMap[i] = PromptSessionIdentifierKeywordsArray[i];
            }

            const masterPrompt = `You are a router for selecting the appropriate AI model based on user queries.  You have access to a map of keywords associated with each model.

            **Keyword Map:**
            
            \`\`\`json
            ${JSON.stringify(keywordMap)}
            \`\`\`
            
            **Instructions:**
            
            1. **Analyze the user query:**  Identify the key topics and concepts in the user's query.
            
            2. **Match keywords:**  Compare the query's key concepts to the keywords associated with each model in the keyword map.
            
            3. **Select the best match:**  Choose the model whose keywords have the strongest overlap with the query's key concepts. If multiple models seem equally relevant, choose the one with the most specific keywords related to the query.
            
            4. **Return the selected model's ID:** Return only the ID of the selected model (e.g., "session0", "session1", etc.). You have to just select session, Do not include any explanations or additional text.  If no model matches the query, return "session0".
            
            
            **Example:**
            
            \`\`\`
            User Query: "What were the main challenges discussed in the section about project management?"
            
            Keyword Map:
            {
              "session0": "introduction, welcome, overview",
              "session1": "project management, challenges, planning, execution, risks",
              "session2": "conclusion, next steps, questions"
            }
            
            Response: session1
            \`\`\`
            `;

            console.log("master Prompt", masterPrompt);
            try {
                const MasterSession = await window?.ai?.languageModel?.create({
                    systemPrompt: masterPrompt,
                });
                setMasterPromptSession(MasterSession);
            } catch (error) {
                console.log(error, "error in generating master prompt")
            }

        } catch (error) {
            console.error("Error initiating prompt sessions:", error); // More specific error message
        } finally {
            setChromePromptSessionLoading(false);
        }
    }
    async function initiateSummarizer(videoSubTitles) {
        initializeSummarizer(videoSubTitles.text, setSummary, setSummaryLoading, model, outputLanguage, GeminiApiKey);
    }

    useEffect(() => {
        if (currentSearch) {
            setMessages(["", "Hii How Can I help you"]);
            fetchVideoSubtitiles(currentSearch);
        }
    }, [currentSearch])

    useEffect(() => {
        if (videoSubTitles) {
            if (model == 'chrome-built-in') {
                initiateChromePromptSession(videoSubTitles);
                initiateSummarizer(videoSubTitles);
            }
        }
        return () => {
            promptSessionArray.forEach(session => {
                session.destroy();
            });
        }
    }, [model, videoSubTitles])

    return (
        <div className='flex text-white px-5 h-full'>
            <Tabs defaultValue="Chat" className="w-full flex flex-col">
                <TabsList>
                    <TabsTrigger value="Chat">Chat</TabsTrigger>
                    <TabsTrigger value="Flashcards">Flashcards</TabsTrigger>
                    <TabsTrigger value="Summary">Summary</TabsTrigger>
                </TabsList>
                <TabsContent value="Chat">
                    <Chat
                        masterPromptSession={masterPromptSession}
                        promptSessionArray={promptSessionArray}
                        messages={messages}
                        setMessages={setMessages}
                        timestampedSubtitles={videoSubTitles.subtitiles}
                        subTitlesLoading={subTitlesLoading}
                        chromePromptSessionLoading={chromePromptSessionLoading}
                        model={model}
                        setModel={setModel}
                    />
                </TabsContent>
                <TabsContent value="Flashcards">Flashcards will be generated here</TabsContent>
                <TabsContent value="Summary">
                    <Summary summary={summary} loading={summaryLoading} model={model} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
