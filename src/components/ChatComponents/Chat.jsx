import React from 'react'
import ChatSearch from './ChatSearch'
import ChatSearchResult from './ChatSearchResult'

export default function Chat() {
    return (
        <div className='h-full flex flex-col'>
            <div className='flex-grow h-[0px] my-2 pr-2 overflow-y-auto'>
                <ChatSearchResult />
            </div>
            <ChatSearch />
        </div>
    )
}
