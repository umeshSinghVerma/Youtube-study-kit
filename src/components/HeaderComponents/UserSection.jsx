import React, { useContext, useEffect, useState } from 'react'
import BellIcon from '../BellIIcon'
import { Languages } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/Select'
import { LanguageContext } from '../../context/LanguageContext';

export default function UserSection() {
    const [outputLanguage, setOutputLanguage] = useState('hi');
    const { updateOutputLanguage } = useContext(LanguageContext);
    useEffect(() => {
        console.log("output value ", outputLanguage);
        updateOutputLanguage(outputLanguage);
    }, [outputLanguage])
    return (
        <div className='flex gap-6 mx-5'>
            <div className='text-white items-center justify-center'>
                <Select>
                    <SelectTrigger onChange={(value) => { setOutputLanguage(value) }} className="bg-transparent">
                        <Languages height={24} width={24} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className='text-white items-center justify-center'>
                <BellIcon height={24} width={24} />
            </div>
            <div className='rounded-full overflow-hidden'>
                <img id="img" draggable="false" alt="Avatar image" height="32" width="32" src="https://yt3.ggpht.com/yygcIpeDdcFgsBIqwOdJrMWfOAKXbFbbDEp1LFSxvLJAgBXx7FakYkqMpo1AL9OVszxlPGh5=s88-c-k-c0x00ffffff-no-rj" />
            </div>

        </div>
    )
}
