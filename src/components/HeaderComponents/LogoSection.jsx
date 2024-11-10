import React from 'react'
import MenuIcon from '../MenuIcon'
export default function LogoSection() {
    return (
        <div className='flex gap-5'>
            <span className='text-white flex items-center rounded-full cursor-pointer hover:bg-[#ffffff1a] w-10 h-10 p-2 justify-center mt-1'>
                <MenuIcon height={24} width={24}/>
            </span>
            <a target='_blank' href='https://frametagger.com' className='flex text-white items-center justify-center gap-1'>
                <img src="/projectLogo.png" alt="" width={30} />
                <p style={{ fontFamily: "Oswald" }} className='text-xl'>YouTube Study Kit</p>
            </a>
        </div>
    )
}
