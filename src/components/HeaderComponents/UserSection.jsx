import React, { useContext, useEffect, useState } from 'react'
import BellIcon from '../BellIIcon'
import { Languages } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/Select'
import { LanguageContext } from '../../context/LanguageContext';
import AvatarMenu from '../AvatarMenu';

export default function UserSection() {
    const [outputLanguage, setOutputLanguage] = useState('en');
    const { updateOutputLanguage } = useContext(LanguageContext);
    useEffect(() => {
        console.log("output value ", outputLanguage);
        updateOutputLanguage(outputLanguage);
    }, [outputLanguage])
    return (
        <div className='flex gap-4 mx-5 text-white items-center justify-around'>
            <div className='text-white items-center justify-around'>
                <Select onValueChange={(val) => setOutputLanguage(val)} defaultValue='en'>
                    <SelectTrigger className='hover:bg-[#5a5a5a45] p-2 rounded-full cursor-pointer bg-transparent'>
                        <Languages height={20} width={20} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className='hover:bg-[#5a5a5a45] p-2 rounded-full cursor-pointer text-white'>
                <BellIcon height={20} width={20} />
            </div>
            {/* <div className='rounded-full overflow-hidden'>
                <img id="img" draggable="false" alt="Avatar image" height="32" width="32" src="https://yt3.ggpht.com/yygcIpeDdcFgsBIqwOdJrMWfOAKXbFbbDEp1LFSxvLJAgBXx7FakYkqMpo1AL9OVszxlPGh5=s88-c-k-c0x00ffffff-no-rj" />
            </div> */}
            <AvatarMenu/>

        </div>
    )
}
