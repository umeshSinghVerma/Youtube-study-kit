import React, { useContext, useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tab"
import Chat from './ChatComponents/Chat'
import Summary from './Summary'
import { getSubTitles } from '../lib/getSubtitles'
import { LanguageContext } from '../context/LanguageContext'
import { detectLanguage } from '../lib/detectLanguage'
import { initializeSummarizer } from '../lib/initializeSummarizer'
import { SearchContext } from '../context/SearchContext'
const initiatePromptSession = async (systemPrompt, setPromptSession) => {
    try {
        const updatedPrompt = systemPrompt.slice(0, 10000);
        const session = await window.ai.languageModel.create({
            systemPrompt: updatedPrompt
        });
        setPromptSession(session);
    }
    catch (e) {
        console.log(e, "Kindly enable the languageModel support in your browser");
    }
}

const getVideoSubtitles = async (videoId, setPromptSession, setVideoSubtitles, setTimestampedSubtitles, convertInputText, setSubtitlesLoading, model) => {
    setSubtitlesLoading(true);
    try {
        const subtitles = await getSubTitles(videoId);
        if (subtitles && subtitles.text && subtitles.subtitles) {
            setTimestampedSubtitles(JSON.stringify(subtitles.subtitles));
            setVideoSubtitles(subtitles.text)
        }
        if (subtitles && subtitles.text && model == 'chrome-built-in') {
            const addOnText = "You are given the subtitles of a Youtube video, when user ask you have to answer with the reference to the video subtitles, Make sure to give short and consise answer do not give long text unless explicitly mentioned, Subtitles are : "
            const subTitleText = subtitles.text;
            const subtitlesLanguage = await detectLanguage(subTitleText.slice(0, 500));

            let updateSubtitlesText = subTitleText;
            if (subtitlesLanguage !== "en") {
                updateSubtitlesText = await convertInputText(subTitleText.slice(0, 9000), subtitlesLanguage);
            }
            setVideoSubtitles(addOnText + updateSubtitlesText);
            await initiatePromptSession(addOnText + updateSubtitlesText, setPromptSession);
        }
    } catch (e) {
        console.log(e, "error in fetching subtitles");
    }
    finally {
        setSubtitlesLoading(false);
    }
    return "";
}
export default function ChatScreen({ currentSearch }) {
    const [promptSession, setPromptSession] = useState(null);
    const [videoSubTitles, setVideoSubtitles] = useState(null);
    const [timestampedSubtitles, setTimestampedSubtitles] = useState(null);
    const { convertInputText, outputLanguage } = useContext(LanguageContext);
    const {GeminiApiKey,model,setModel} = useContext(SearchContext);
    const [subTitlesLoading, setSubtitlesLoading] = useState(false);
    const [messages, setMessages] = useState(["", "Hii How Can I help you"]);
    const [summary, setSummary] = useState(null);
    const [summaryLoading, setSummaryLoading] = useState(false);

    useEffect(() => {
        if (videoSubTitles != null) {
            initializeSummarizer(videoSubTitles, setSummary, setSummaryLoading, model, outputLanguage,GeminiApiKey);
        }
    }, [videoSubTitles, model, outputLanguage]);



    useEffect(() => {
        setMessages(["", "Hii How Can I help you"]);
    }, [currentSearch])

    useEffect(() => {
        if (promptSession != null) {
            promptSession.destroy();
        }
        if (currentSearch) {
            getVideoSubtitles(currentSearch, setPromptSession, setVideoSubtitles, setTimestampedSubtitles, convertInputText, setSubtitlesLoading, model);
        }
    }, [currentSearch])
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
                        promptSession={promptSession}
                        messages={messages}
                        setMessages={setMessages}
                        timestampedSubtitles={timestampedSubtitles}
                        subTitlesLoading={subTitlesLoading}
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
