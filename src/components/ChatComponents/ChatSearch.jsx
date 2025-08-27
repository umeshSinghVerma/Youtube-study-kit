import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/Select";
import PaperclipIcon from '../PaperClipIcon';
import ArrowUpIcon from '../ArrowUpIcon';
import { getPromptResult, getStreamingPromptResult } from '../../lib/getPromptResult';
import { LanguageContext } from '../../context/LanguageContext';
import { getGeminiResponse } from '../../lib/getGeminiResponse';
import { generatePromptSession } from '../../lib/generateKeywordMap';
import { SearchContext } from '../../context/SearchContext';

export default function ChatSearch({ messages, setMessages, timestampedSubtitles, masterPromptSession, promptSessionArray, setPromptSessionArray, subtitleChunkArray, subTitlesLoading, model, setModel }) {
    const [disabled, setDisabled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { convertOutputText, outputLanguage } = useContext(LanguageContext);
    const { currentSearch, GeminiApiKey,canUseChromeAi } = useContext(SearchContext);

    const handleStreamResponse = async (newChunk) => {
        try {
            const outputText = await convertOutputText(newChunk);
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1] += outputText;
                return updatedMessages;
            });
        } catch (error) {
            console.log(error, 'error in translating output message');
        }
    };

    const handleSubmit = async (model) => {
        if (searchQuery.trim() && !disabled) {
            setDisabled(true);
            setMessages((prevMessages) => [...prevMessages, searchQuery, ""]);
            setSearchQuery("");
            if (model == 'chrome-built-in') {
                try {
                    const sessionIdString = await masterPromptSession.prompt(searchQuery);
                    console.log("sessionIdString", sessionIdString);

                    // Extracting the last character and converting it to a number
                    let promptSessionId = parseInt(sessionIdString.slice(-1), 10);
                    console.log("promptSessionId", promptSessionId);

                    // Validate and adjust `promptSessionId`
                    if (Number.isNaN(promptSessionId) || promptSessionId >= subtitleChunkArray.length) {
                        promptSessionId = 0;
                    }
                    let session = promptSessionArray[promptSessionId];
                    if (!session) {
                        session = await generatePromptSession(subtitleChunkArray[promptSessionId]);
                        setPromptSessionArray(prev => ({ ...prev, [promptSessionId]: session }));
                    }

                    // Call `getStreamingPromptResult` with a valid `promptSessionId`
                    const UpdatedQuery = searchQuery + " give me the response in the described format, give integer time after each paragraph in curly braces for example {45} etc. Never include time range in curly braces. Give answer in headings, subheadings and bullet points"
                    await getStreamingPromptResult(
                        session,
                        UpdatedQuery,
                        handleStreamResponse
                    );

                } catch (error) {
                    console.log("Error in handleSearch:", error);
                }
            } else if (model == 'gemini') {
                console.log("came in gemini")
                const prompt = {
                    mode: 'chat',
                    text: searchQuery
                }
                if (GeminiApiKey) {
                    await getGeminiResponse(prompt, messages, timestampedSubtitles, outputLanguage, currentSearch, "", "", null, setMessages, GeminiApiKey);
                }
            }
            setDisabled(false);
        }
    }

    return (
        <div className='flex flex-col gap-1 my-2 border border-[#262626] rounded-2xl p-2'>
            <input
                type='text'
                className='w-full outline-none bg-transparent placeholder:text:[#ffffffe0] px-3'
                placeholder='Ask anything...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSubmit(model);
                    }
                }}
            />
            <div className='text-[#ffffffe0] flex justify-between'>
                <div>
                    <Select onValueChange={(val) => setModel(val)} value={model}>
                        <SelectTrigger className="bg-transparent">
                            <SelectValue placeholder="gemini" />
                        </SelectTrigger>
                        <SelectContent>
                            {canUseChromeAi && <SelectItem value="chrome-built-in">chrome-built-in</SelectItem>}
                            <SelectItem value="gemini">gemini</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex items-center justify-center gap-5 mr-1'>
                    <button>
                        <PaperclipIcon width={24} height={24} />
                    </button>
                    <button
                        disabled={!searchQuery.trim() || disabled || subTitlesLoading}
                        className={`text-black bg-white flex items-center active:scale-95 justify-center rounded-xl h-[30px] w-[30px] ${(disabled || subTitlesLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => { handleSubmit(model) }}
                    >
                        <ArrowUpIcon width={24} height={24} />
                    </button>
                </div>
            </div>
        </div>
    )
}
