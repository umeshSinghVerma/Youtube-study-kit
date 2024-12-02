/* global chrome */
let detector = null;

try {
    const canDetect = await window.translation.canDetect();
    if (canDetect !== 'no') {
        if (canDetect === 'readily') {
            detector = await window.translation.createDetector();

        } else {
            detector = await window.translation.createDetector();
            detector.addEventListener('downloadprogress', (e) => {
                console.log(e.loaded, e.total);
            });
            await detector.ready;
        }
    } else {
        console.log("The language detector can't be used at all.");
    }
} catch (e) {
    console.log(e);
}


export async function detectLanguage(text) {
    try {
        if (detector) {
            const results = await detector.detect(text);
            return results[0].detectedLanguage;
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}