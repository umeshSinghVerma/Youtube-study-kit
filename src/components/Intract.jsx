import React from 'react'
import ChatScreen from './ChatScreen'
import { SearchProvider } from '../context/SearchContext'
import Header from './Header'

export default function Intract() {
    return (
        <SearchProvider>
            <div className='flex-col h-screen w-screen overflow-hidden bg-[#0f0f0f]'>
                <div className='h-[60px]'>
                    <Header/>
                </div>
                <div className='flex flex-grow h-full'>
                    <div className='w-[60%] bg-yellow-50 overflow-y-auto'>
                        pdf Intraction
                    </div>
                    <div className='w-[40%] bg-red-50'>
                        <ChatScreen />
                    </div>
                </div>
            </div>
        </SearchProvider>
    )
}
