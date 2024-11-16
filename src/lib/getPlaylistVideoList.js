import axios from 'axios';
export async function getPlaylistVideoList(playlistId) {
    try {
        const data = await axios.post("https://extension-server-pi.vercel.app/getPlayListVideoList", {
            playlistId: playlistId
        })
        console.log(data);
        return data;
    } catch (e) {
        console.log(e);
        return [];
    }
};
