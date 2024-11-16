import React from 'react'
import { MascotSvg } from './MascotSvg'

export default function NoSearchComponent() {
    return (
        <div className='flex flex-col text-white items-center h-full pt-20 gap-3'>
            <div className='w-[200px]'>
                <MascotSvg />
            </div>
            <div className="flex flex-col items-center justify-center text-center space-y-2 p-4 bg-[#ffffff14] rounded-md shadow-md">
                <p className="text-lg font-semibold text-gray-100">Try searching to get started</p>
                <p className="text-sm text-gray-400">
                    It looks like the notes you're searching for haven't been taken yet. Kindly start by taking notes from the YouTube video.
                </p>
            </div>
        </div>
    )
}
