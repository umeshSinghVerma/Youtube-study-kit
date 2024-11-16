import axios from 'axios';
export async function getOnlineSearchResults(searchQuery) {
    try {
        const data = await axios.post("https://extension-server-pi.vercel.app/getSearchResults", {
            query: searchQuery
        })
        console.log(data);
        return data;
    } catch (e) {
        console.log(e);
        return [];
    }
};
