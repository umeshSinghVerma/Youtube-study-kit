import React, { useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/Select";
import PaperclipIcon from '../PaperClipIcon';
import ArrowUpIcon from '../ArrowUpIcon';
import { getPromptResult } from '../../lib/getPromptResult';

export default function ChatSearch({ setMessages, promptSession }) {
    const [aiModel, setAiModel] = useState('chrome-built-in');
    const [disabled, setDisabled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleStreamResponse = (newChunk) => {
        setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1] = newChunk;
            return updatedMessages;
        });
    };

    const handleSubmit = async () => {
        if (searchQuery.trim() && !disabled) {
            setDisabled(true);
            setMessages((prevMessages) => [...prevMessages, searchQuery, ""]);
            setSearchQuery("");
            await getPromptResult(promptSession, searchQuery, handleStreamResponse);
            setDisabled(false);
        }
    };

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
                        handleSubmit();
                    }
                }}
            />
            <div className='text-[#ffffffe0] flex justify-between'>
                <div>
                    <Select onValueChange={(val) => setAiModel(val)} defaultValue='gemini'>
                        <SelectTrigger className="bg-transparent">
                            <SelectValue placeholder="gemini" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="chrome-inbuilt">chrome-inbuilt</SelectItem>
                            <SelectItem value="gemini">gemini</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex items-center justify-center gap-5 mr-1'>
                    <button>
                        <PaperclipIcon width={24} height={24} />
                    </button>
                    <button
                        disabled={!searchQuery.trim() || disabled}
                        className={`text-black bg-white flex items-center active:scale-95 justify-center rounded-xl h-[30px] w-[30px] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleSubmit}
                    >
                        <ArrowUpIcon width={24} height={24} />
                    </button>
                </div>
            </div>
        </div>
    )
}
