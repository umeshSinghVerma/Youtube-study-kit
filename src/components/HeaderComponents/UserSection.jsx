import React from 'react'
import BellIcon from '../BellIIcon'

export default function UserSection() {
    return (
        <div className='flex gap-6 mx-5'>
            <div className='text-white items-center justify-center'>
                <BellIcon height={24} width={24}/>
            </div>
            <div className='rounded-full overflow-hidden'>
                <img id="img" draggable="false" alt="Avatar image" height="32" width="32" src="https://yt3.ggpht.com/yygcIpeDdcFgsBIqwOdJrMWfOAKXbFbbDEp1LFSxvLJAgBXx7FakYkqMpo1AL9OVszxlPGh5=s88-c-k-c0x00ffffff-no-rj" />
            </div>

        </div>
    )
}
