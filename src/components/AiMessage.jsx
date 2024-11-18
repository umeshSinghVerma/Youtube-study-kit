import React, { useContext } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function AiMessage({ message }) {
    if (message.length == 0) return null;
    return (
        <div className='text-white border rounded-xl border-[#2f2f2f] w-fit p-3 flex flex-col gap-2 '>
            <Markdown remarkPlugins={[remarkGfm]}>{message}</Markdown>
        </div>
    )
}
