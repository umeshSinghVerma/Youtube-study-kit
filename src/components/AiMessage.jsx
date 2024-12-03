import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Thinking from './Thinking';
import { useContext } from 'react';
import { SearchContext } from '../context/SearchContext';

export default function AiMessage({ message }) {
    const { currentSearch } = useContext(SearchContext);

    // Convert seconds to hh:mm:ss format
    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return [hrs, mins, secs]
            .map((val, key) => (key === 0 && val === 0) ? "" : String(val).padStart(2, "0"))
            .filter((val) => val !== "") // Avoid empty values for hours when not needed
            .join(":");
    };

    // Define both regex patterns
    const pattern1 = /\{(\d+)\}/g; // Matches `{time}` format
    const pattern2 = /(\[)(\d+(\.\d+)?)(\]\(\/index\.html#\/intract\?videoId=[^&]+&timestamp=)(\d+(\.\d+)?)(\))/g; // Matches `[time](url)` format

    let updatedMessage = message;

    try {
        if (pattern1.test(message)) {
            // Handle `{time}` format
            updatedMessage = message.replace(pattern1, (match, time) => {
                const timeInSeconds = parseInt(time, 10); // Convert time to an integer
                const formattedTime = formatTime(timeInSeconds); // Format time into hh:mm:ss

                // Generate the video link using currentSearch.videoId
                const videoId = currentSearch; // Use a default if videoId is unavailable
                const videoLink = `/index.html#/intract?videoId=${videoId}&timestamp=${timeInSeconds}`;

                // Return formatted Markdown link
                return `[${formattedTime}](${videoLink})`;
            });
        } else if (pattern2.test(message)) {
            // Handle `[time](url)` format
            updatedMessage = message.replace(pattern2, (match, openBracket, displayTime, _, middlePart, timestamp, __, closeBracket) => {
                const displayTimeInSeconds = Math.floor(parseFloat(displayTime)); // Convert to integer
                const formattedTime = formatTime(displayTimeInSeconds); // Format time
                return `${openBracket}${formattedTime}${middlePart}${Math.floor(parseFloat(timestamp))}${closeBracket}`;
            });
        }
    } catch (error) {
        console.log(error, "Error while parsing regex");
    }

    if (updatedMessage.length === 0) {
        return (
            <div className='text-white border rounded-xl border-[#2f2f2f] w-fit p-3 flex flex-col gap-2'>
                <Thinking />
            </div>
        );
    }

    return (
        <div className='text-white border rounded-xl border-[#2f2f2f] w-fit p-3 flex flex-col gap-2'>
            <Markdown remarkPlugins={[remarkGfm]}>
                {updatedMessage}
            </Markdown>
        </div>
    );
}
