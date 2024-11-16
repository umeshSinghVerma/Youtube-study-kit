import { YoutubeTranscript } from 'youtube-transcript';

export async function getSubTitles(videoId) {
    try {
        const transcript = await YoutubeTranscript.fetchTranscript(videoId);
        let res = "";
        transcript.forEach(ele => {
            res += ele.text+" ";
        });
        return { text: JSON.stringify(res), subtitles: transcript };
    } catch (error) {
        console.error('Error fetching captions:', error); // Log the full error
        throw new Error('Captions cannot be generated for this video.');
    }
}
