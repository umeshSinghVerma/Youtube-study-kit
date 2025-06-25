import React, { useContext, useEffect, useRef, useState } from 'react';
import ChatSearch from './ChatSearch';
import ChatSearchResult from './ChatSearchResult';
import SubtitlesLoading from '../SubtitlesLoading';


export default function Chat({ masterPromptSession, promptSessionArray, setPromptSessionArray, subtitleChunkArray, subTitlesLoading, chromePromptSessionLoading, timestampedSubtitles, messages, setMessages, model, setModel }) {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className='h-full flex flex-col'>
            <div ref={messagesEndRef} className='flex-grow h-[0px] my-2 pr-2 overflow-y-auto'>
                {
                    !(subTitlesLoading || (chromePromptSessionLoading && model == "chrome-built-in")) ? <ChatSearchResult messages={messages} /> : <SubtitlesLoading />
                }
            </div>
            <ChatSearch
                messages={messages}
                setMessages={setMessages}
                masterPromptSession={masterPromptSession}
                promptSessionArray={promptSessionArray}
                setPromptSessionArray={setPromptSessionArray}
                subtitleChunkArray={subtitleChunkArray}
                timestampedSubtitles={timestampedSubtitles}
                subTitlesLoading={subTitlesLoading}
                model={model}
                setModel={setModel}
            />
        </div>
    );
}
