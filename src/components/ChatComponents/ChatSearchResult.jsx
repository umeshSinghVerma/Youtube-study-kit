import React from 'react'
import HumanMessage from '../HumanMessage'
import AiMessage from '../AiMessage'

const messages = [
    "Hii there",
    "How can I help you",
    "Tell me about yourself",
    "Welcome to the chat! Ask me anything. I may not always be right, but your feedback will help me improve!",
    "Tell me about yourself",
    "Welcome to the chat! Ask me anything. I may not always be right, but your feedback will help me improve!",
    "Tell me about yourself",
    "Welcome to the chat! Ask me anything. I may not always be right, but your feedback will help me improve!",
    "Tell me about yourself",
    "Welcome to the chat! Ask me anything. I may not always be right, but your feedback will help me improve!",
    "Tell me about yourself",
    "*Welcome to the chat! Ask me anything. I may not always be right, but your feedback will help me improve!*"
]
export default function ChatSearchResult() {
    return (
        <div className='flex flex-col gap-2'>
            {
                messages.map((message, key) => {
                    if (key % 2==0) {
                        return <HumanMessage key={key} message={message} />
                    } else {
                        return <AiMessage key={key} message={message} />
                    }
                })
            }
        </div>
    )
}
