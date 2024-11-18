import React, { useContext } from 'react'
import HumanMessage from '../HumanMessage'
import AiMessage from '../AiMessage'

export default function ChatSearchResult({ messages }) {
    return (
        <div className='flex flex-col gap-2'>
            {
                messages.map((message, key) => {
                    if (key % 2 == 0) {
                        return <HumanMessage key={key} message={message} />
                    } else {
                        return <AiMessage key={key} message={message} />
                    }
                })
            }
        </div>
    )
}
