import React from 'react'

export default function HumanMessage({ message, messagesEndRef }) {
    if (message.length == 0) return null;
    return (
        <div ref={messagesEndRef} className='text-white bg-[#ffffff14] border max-w-[80%] rounded-xl border-[#2f2f2f] w-fit p-3 ml-auto'>
            {message}
        </div>
    )
}
