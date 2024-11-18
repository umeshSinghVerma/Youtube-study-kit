/* global chrome */

const canDetect = await window.translation.canDetect();
let detector;
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

export async function detectLanguage(text) {
    try {
        const results = await detector.detect(text);
        return results[0].detectedLanguage;
    } catch (error) {
        console.log(error);
        return null;
    }
}