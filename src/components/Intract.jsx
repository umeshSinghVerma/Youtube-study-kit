import React, { useContext, useEffect, useState } from 'react'
import ChatScreen from './ChatScreen'
import { SearchContext, SearchProvider } from '../context/SearchContext'
import Header from './Header'
import NotesIntract from './NotesIntract'
import NoSearchComponent from './NoSearchComponent'
import { useSearchParams } from 'react-router-dom'

export default function Intract() {
    const { loading, currentSearch, updateCurrentSearch, UserData } = useContext(SearchContext);
    // let [searchParams, setSearchParams] = useSearchParams();
    // useEffect(() => {
    //     const passedVideoId = searchParams.get("videoId");
    //     if (passedVideoId) {
    //         console.log("passedVideoId",passedVideoId);
    //         updateCurrentSearch(passedVideoId);
    //     }
    // }, [])

    return (
        <div className='bg-[#0f0f0f] h-screen w-screen flex flex-col'>
            <div className='h-[60px]'>
                <Header />
            </div>
            <div className='flex flex-grow'>
                <div className='w-[60%] overflow-y-auto '>
                    {
                        loading ?
                            <NoSearchComponent /> :
                            (currentSearch && UserData[currentSearch]) ?
                                <NotesIntract currentSearch={currentSearch} UserData={UserData} /> :
                                <NoSearchComponent />
                    }
                </div>
                <div className='w-[40%] bg-[#0f0f0f]'>
                    <ChatScreen currentSearch={currentSearch} />
                </div>
            </div>
        </div>
    )
}
