import React, { useCallback, useContext, useEffect, useState } from 'react'
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LanguageContext } from '../context/LanguageContext';
import { Loader } from 'lucide-react';

export default function Summary({ summary, loading, model }) {
    const { outputLanguage, convertOutputText } = useContext(LanguageContext);
    const [translatedSummaryText, setTranslatedSummaryText] = useState("");

    const translatedSummary = async (summary) => {
        try {
            if (summary) {
                const translatedText = await convertOutputText(summary);
                setTranslatedSummaryText(translatedText);
            }
        } catch (error) {
            console.log(error, "error in translating summary");
            return summary;
        }
    };

    useEffect(() => {
        if (model == 'chrome-built-in') {
            translatedSummary(summary);
        } else {
            setTranslatedSummaryText(summary);
        }
    }, [summary, outputLanguage, model]);
    return (
        <div className='text-white border rounded-xl h-[99%] w-full border-[#2f2f2f] p-3 flex flex-col items-center gap-2 '>
            {
                loading ?
                    <div className='w-full h-full items-center justify-center flex'>
                        <div className='animate-spin'>
                            <Loader />
                        </div>
                    </div> :
                    <div className='flex-grow h-[0px] my-2 pr-2 overflow-y-auto flex flex-col gap-1'>
                        <Markdown remarkPlugins={[remarkGfm]}>{translatedSummaryText}</Markdown>
                    </div>
            }
        </div>
    )
}
