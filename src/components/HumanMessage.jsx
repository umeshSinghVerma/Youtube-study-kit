import React from 'react'

export default function HumanMessage({ message }) {
    return (
        <div className='text-white bg-[#ffffff14] border rounded-xl border-[#2f2f2f] w-fit p-3 ml-auto'>
            {message}
        </div>
    )
}
