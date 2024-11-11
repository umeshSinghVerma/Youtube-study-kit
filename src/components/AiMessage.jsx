import React from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function AiMessage({ message }) {
    return (
        <div className='text-white border rounded-xl border-[#2f2f2f] w-fit p-3'>
            <Markdown remarkPlugins={[remarkGfm]}>{message}</Markdown>
        </div>
    )
}
