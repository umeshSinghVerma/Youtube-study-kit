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

            const { keywordMap, subtitleChunkArray } = await generateKeywordMap(completeSubtitlesArray, currentSearch);
            setPromptSessionArray({});
            setSubtitleChunkArray(subtitleChunkArray);
            console.log("keywordMap", keywordMap);

            const masterPrompt = `
            SYSTEM
            You route user queries to one session ID using ONLY the KeywordMap JSON below. Be concise and deterministic.

            KEYWORDMAP (JSON)
            ${JSON.stringify(keywordMap)}

            BEHAVIOR
            - On each user message, select exactly one ID from the map's keys.
            - Normalize: lowercase the user message and all keywords; trim spaces.
            - Keywords: each map value may be a comma-separated string or an array; treat each entry as a full phrase.
            - Match rule: a keyword matches if its full phrase appears in the user message as a whole-word/phrase substring.
            - Score: count matches per session.
            - Tie-breakers: (1) greater total characters across matched keywords; (2) lexicographically smallest session ID.
            - Fallback: if no matches, return "session0" (if present), otherwise the lexicographically smallest ID.

            OUTPUT
            Return ONLY the chosen session ID (e.g., session1). No explanations, no quotes, no extra text.
            `;

            console.log("master Prompt", masterPrompt);
            try {
                const MasterSession = await window?.LanguageModel?.create({
                    initialPrompts: [{ role: "system", content: masterPrompt }]
                });
                setMasterPromptSession(MasterSession);
                console.log("Master Session:", MasterSession);
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
