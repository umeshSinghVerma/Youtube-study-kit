export async function getPromptResult(session, prompt, updateResponse) {
    console.log("start" + `${session.tokensSoFar}/${session.maxTokens} (${session.tokensLeft} left)`);
    const stream = session.promptStreaming(prompt);
    for await (const chunk of stream) {
        updateResponse(chunk)
    }
    console.log(`${session.tokensSoFar}/${session.maxTokens} (${session.tokensLeft} left)`);
}