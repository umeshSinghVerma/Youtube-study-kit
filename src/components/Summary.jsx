import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
async function initializeSummarizer(subtitles, setSummary, setLoading) {
    let summarizer = null;
    try {
        setLoading(true);
        const canSummarize = await window.ai.summarizer.capabilities();
        if (canSummarize && canSummarize.available !== 'no') {
            if (canSummarize.available === 'readily') {
                summarizer = await window.ai.summarizer.create();
                console.log("summarizer activated")
                let result = '';
                for (let i = 0; i < subtitles.length; i += 4000) {
                    try {
                        const summaryPart = await summarizer.summarize(subtitles.slice(i, i + 4000));
                        result += summaryPart + '\n';
                    } catch (error) {
                        console.error("Error summarizing part", i, error);
                    }
                    setSummary(result);
                }
            } else {
                summarizer = await window.ai.summarizer.create();
                summarizer.addEventListener('downloadprogress', (e) => {
                    console.log(e.loaded, e.total);
                });
                await summarizer.ready;
            }
        } else {
            console.log("The summarizer can't be used at all.");
        }
    } catch (error) {
        console.log(error, "Error in initializing summarizer");
    }
    finally {
        if (summarizer != null) summarizer.destroy();
        setLoading(false);
    }

}
export default function Summary({ subtitles }) {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (subtitles != null) {
            initializeSummarizer(subtitles, setSummary, setLoading);
        }
    }, [subtitles]);
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
                        <Markdown remarkPlugins={[remarkGfm]}>{summary}</Markdown>
                    </div>

            }
        </div>
    )
}
