import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Thinking from './Thinking';

export default function AiMessage({ message }) {
    // Regex to match [time](url) globally, handling floating-point timestamps
    const regex = /(\[)(\d+(\.\d+)?)(\]\(\/index\.html#\/intract\?videoId=[^&]+&timestamp=)(\d+(\.\d+)?)(\))/g;

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

    // Replace all timestamps in the message
    const updatedMessage = message.replace(regex, (match, openBracket, displayTime, _, middlePart, timestamp, __, closeBracket) => {
        const displayTimeInSeconds = Math.floor(parseFloat(displayTime)); // Convert to integer
        const formattedTime = formatTime(displayTimeInSeconds); // Format time
        return `${openBracket}${formattedTime}${middlePart}${Math.floor(parseFloat(timestamp))}${closeBracket}`;
    });

    console.log(updatedMessage);

    // Update the message variable
    message = updatedMessage;

    if (message.length === 0) {
        return (
            <div className='text-white border rounded-xl border-[#2f2f2f] w-fit p-3 flex flex-col gap-2'>
                <Thinking />
            </div>
        );
    }

    return (
        <div className='text-white border rounded-xl border-[#2f2f2f] w-fit p-3 flex flex-col gap-2'>
            <Markdown remarkPlugins={[remarkGfm]}>
                {message}
            </Markdown>
        </div>
    );
}
