import React from 'react'
import SearchIcon from '../SearchIcon'
import MicIcon from '../MicIcon'

export default function SearchSection() {
    return (
        <div className='flex gap-5'>
            <div className='flex rounded-full border bg-[#121212] border-[#303030] overflow-hidden'>
                <div className='p-[6px] pl-4'>
                    <input type="text" placeholder='Search' className='w-[500px] placeholder:text:[#ffffffe0] bg-transparent h-[26px] outline-none text-white' />
                </div>
                <div className='bg-[#ffffff14] text-white w-[60px] flex items-center justify-center'>
                    <span className='w-[24px] h-[24px]'>
                        <SearchIcon height={24} width={24}/>
                    </span>
                </div>
            </div>
            <div className='bg-[#ffffff14] w-[43px] rounded-full text-white  flex items-center justify-center'>
                <span className='h-[24px] w-[24px]'>
                    <MicIcon height={24} width = {24}/>
                </span>
            </div>
        </div>
    )
}
