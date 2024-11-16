import React, { useContext, useEffect, useRef, useState } from 'react';
import ChatSearch from './ChatSearch';
import ChatSearchResult from './ChatSearchResult';
import { getSubTitles } from '../../lib/getSubtitles';
import { SearchContext } from '../../context/SearchContext';


export default function Chat({ promptSession }) {
    const [messages, setMessages] = useState(["", "Hii How Can I help you"]);
    const messagesEndRef = useRef(null);


    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className='h-full flex flex-col'>
            <div ref={messagesEndRef} className='flex-grow h-[0px] my-2 pr-2 overflow-y-auto'>
                <ChatSearchResult messages={messages} />
            </div>
            <ChatSearch setMessages={setMessages} promptSession={promptSession} />
        </div>
    );
}
