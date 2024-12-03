export async function getPlaylistVideoList(playListId) {
    const bodyContent = JSON.stringify({
        "playListId": playListId
    });

    try {
        const response = await fetch("https://extension-server-pi.vercel.app/getPlayListVideoList", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: bodyContent,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (e) {
        console.error(e, "error in fetching playlist videos");
        return null;
    }
}