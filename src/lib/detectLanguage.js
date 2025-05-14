/* global chrome */
let detector = null;

try {
    const canDetect = await window.LanguageDetector.availability();
    if (canDetect !== 'unavailable') {
        if (canDetect === 'available') {
            detector = await window.LanguageDetector.create();
        } else {
            detector = await window.LanguageDetector.create({
               monitor(m) {
                 m.addEventListener('downloadprogress', (e) => {
                   console.log(`Downloaded ${e.loaded * 100}%`);
                 });
                },
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
