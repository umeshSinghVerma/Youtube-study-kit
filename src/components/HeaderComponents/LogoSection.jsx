import React from 'react'
import Sidebar from '../Sidebar'
export default function LogoSection() {
    return (
        <div className='flex gap-5'>
            <Sidebar />
            <a target='_blank' href='https://Youtube Study Kit.com' className='flex text-white items-center justify-center gap-1'>
                <img src="/projectLogo.png" alt="" width={30} />
                <p style={{ fontFamily: "Oswald" }} className='text-xl'>YouTube Study Kit</p>
            </a>
        </div>
    )
}
