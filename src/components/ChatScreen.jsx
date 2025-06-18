import React, { useContext, useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tab"
import Chat from './ChatComponents/Chat'
import Summary from './Summary'
import { getSubTitles } from '../lib/getSubtitles'
import { LanguageContext } from '../context/LanguageContext'
import { detectLanguage } from '../lib/detectLanguage'
import { initializeSummarizer } from '../lib/initializeSummarizer'
import { SearchContext } from '../context/SearchContext'
import { generateKeywordMap } from '../lib/generateKeywordMap'
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
    const [promptSessionArray, setPromptSessionArray] = useState({});
    const [subtitleChunkArray, setSubtitleChunkArray] = useState([]);
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
            console.log("setChromePromptSessionLoading true", performance.now());
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

            console.time("getkeywords-sessions");
            const { keywordMap, subtitleChunkArray } = await generateKeywordMap(completeSubtitlesArray, currentSearch);
            setPromptSessionArray({});
            setSubtitleChunkArray(subtitleChunkArray);
            console.timeEnd("getkeywords-sessions");
            console.log("keywordMap", keywordMap);

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
                console.time("mastersession");
                const MasterSession = await window?.LanguageModel?.create({
                    initialPrompts: [{ role: "system", content: masterPrompt }]
                });
                console.timeEnd("mastersession");
                setMasterPromptSession(MasterSession);
                console.log("Master Session:", MasterSession);
            } catch (error) {
                console.log(error, "error in generating master prompt")
            }

        } catch (error) {
            console.error("Error initiating prompt sessions:", error); // More specific error message
        } finally {
            console.log("setChromePromptSessionLoading false", performance.now());
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
        if (videoSubTitles && Array.isArray(videoSubTitles.subtitiles) && videoSubTitles.subtitiles.length > 0) {
            if (model == 'chrome-built-in') {
                initiateChromePromptSession(videoSubTitles);
            }
        }
        return () => {
            Object.values(promptSessionArray).forEach(session => {
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
                        setPromptSessionArray={setPromptSessionArray}
                        subtitleChunkArray={subtitleChunkArray}
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
                    <Summary
                        summary={summary}
                        loading={summaryLoading}
                        model={model}
                        onGenerateSummary={() => initiateSummarizer(videoSubTitles)}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
