import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/Select"
import PaperclipIcon from '../PaperClipIcon';
import ArrowUpIcon from '../ArrowUpIcon';

export default function ChatSearch() {
    const [aiModel, setAiModel] = useState('gemini');
    const [disabled, setDisabled] = useState(true);
    return (
        <div className='flex flex-col gap-1 my-2 border border-[#262626] rounded-2xl p-2'>
            <div></div>
            <div>
                <input
                    type='text'
                    className='w-full outline-none bg-transparent placeholder:text:[#ffffffe0] px-3'
                    placeholder='Ask anything...' />
            </div>
            <div className='text-[#ffffffe0] flex justify-between'>
                <div>
                    <Select onValueChange={(val) => setAiModel(val)} defaultValue='gemini'>
                        <SelectTrigger>
                            <SelectValue placeholder="gemini" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="chrome-inbuilt">chrome-inbuilt</SelectItem>
                            <SelectItem value="gemini">gemini</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex items-center justify-center gap-5 mr-1'>
                    <button>
                        <PaperclipIcon width={24} height={24} />
                    </button>
                    <button style={{ backgroundColor: disabled ? "#ffffffe0" : "white", cursor: disabled ? "not-allowed" : "pointer" }} className="text-black flex items-center justify-center rounded-xl h-[30px] w-[30px]">
                        <ArrowUpIcon width={24} height={24} />
                    </button>
                </div>
            </div>
        </div>
    )
}
