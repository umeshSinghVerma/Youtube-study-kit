import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tab"
import Chat from './ChatComponents/Chat'
import Summary from './Summary'
import { getSubTitles } from '../lib/getSubtitles'
const initiatePromptSession = async (systemPrompt, setPromptSession) => {
    try {
        const updatedPrompt = systemPrompt.slice(0, 10000);
        console.log(updatedPrompt);
        const session = await window.ai.languageModel.create({
            systemPrompt: updatedPrompt
        });
        setPromptSession(session);
    }
    catch (e) {
        console.log(e, "Kindly enable the languageModel support in your browser");
    }
}

const getVideoSubtitles = async (videoId, setPromptSession, setVideoSubtitles) => {
    try {
        const subtitles = await getSubTitles(videoId);
        if (subtitles && subtitles.text) {
            const subTitleText = "You are given the subtitles of a Youtube video, when user ask you have to answer with the reference to the video subtitles, Make sure to give short and consise answer do not give long text unless explicitly mentioned, Subtitles are : " + subtitles.text;
            setVideoSubtitles(subTitleText);
            await initiatePromptSession(subTitleText, setPromptSession);
        }
    } catch (e) {
        console.log(e, "error in fetching subtitles");
    }
    return "";
}
export default function ChatScreen({ currentSearch }) {
    const [promptSession, setPromptSession] = useState(null);
    const [videoSubTitles, setVideoSubtitles] = useState(null);

    useEffect(() => {
        if (promptSession != null) {
            promptSession.destroy();
        }
        if (currentSearch) {
            getVideoSubtitles(currentSearch, setPromptSession, setVideoSubtitles);
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
                <TabsContent value="Chat"><Chat promptSession={promptSession} /></TabsContent>
                <TabsContent value="Flashcards">Change your password here.</TabsContent>
                <TabsContent value="Summary"><Summary subtitles={videoSubTitles} /></TabsContent>
            </Tabs>
        </div>
    )
}
