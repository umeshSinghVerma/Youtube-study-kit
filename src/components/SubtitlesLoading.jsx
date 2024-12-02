import { Loader } from 'lucide-react'
import React from 'react'

export default function SubtitlesLoading() {
    return (
        <div className='flex flex-col justify-center items-center text-white text-sm h-full gap-1'>
            <div className='animate-spin'>
                <Loader />
            </div>
            <p>Hold on! We are processing Video Information</p>
        </div>
    )
}
