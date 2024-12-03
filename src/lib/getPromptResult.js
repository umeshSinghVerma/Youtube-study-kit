export async function getStreamingPromptResult(session, prompt, updateResponse) {
    try {
        console.log("start" + `${session.tokensSoFar}/${session.maxTokens} (${session.tokensLeft} left)`);
        const stream = session.promptStreaming(prompt);
        for await (const chunk of stream) {
            updateResponse(chunk)
        }
        console.log(`${session.tokensSoFar}/${session.maxTokens} (${session.tokensLeft} left)`);
    } catch (error) {
        updateResponse(error);
        console.log(error);
    }
}

export async function getPromptResult(session, prompt) {
    try {
        console.log("start" + `${session.tokensSoFar}/${session.maxTokens} (${session.tokensLeft} left)`);
        const result = await session.prompt(prompt);
        console.log(`${session.tokensSoFar}/${session.maxTokens} (${session.tokensLeft} left)`);
        return result;
    } catch (error) {
        console.log(error);
    }
    return "";
}