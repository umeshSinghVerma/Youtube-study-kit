import React, { useContext } from 'react'
import ChatScreen from './ChatScreen'
import { SearchContext, SearchProvider } from '../context/SearchContext'
import Header from './Header'
import NotesIntract from './NotesIntract'

export default function Intract() {
    const { loading } = useContext(SearchContext);
    return (
            <div className='bg-[#0f0f0f] h-screen w-screen flex flex-col'>
                <div className='h-[60px]'>
                    <Header />
                </div>
                <div className='flex flex-grow'>
                    <div className='w-[60%] overflow-y-auto '>
                        {!loading && <NotesIntract />}
                    </div>
                    <div className='w-[40%] bg-[#0f0f0f]'>
                        <ChatScreen />
                    </div>
                </div>
            </div>
    )
}
