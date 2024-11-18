/* global chrome */

const languagePair = {
    sourceLanguage: 'en', // Or detect the source language with the Language Detection API
    targetLanguage: 'es',
  };
  
  const canTranslate = await window.translation.canTranslate(languagePair);
  let translator;
  if (canTranslate !== 'no') {
    if (canTranslate === 'readily') {
      // The translator can immediately be used.
      translator = await window.translation.createTranslator(languagePair);
    }/* else {
      // The translator can be used after the model download.
      translator = await translation.createTranslator(languagePair);
      translator.addEventListener('downloadprogress', (e) => {
        console.log(e.loaded, e.total);
      });
      await translator.ready;
    } */
  } else {
      // The translator can't be used at all.
  }
  