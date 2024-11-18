/* global chrome */

import React, { createContext, useEffect, useState } from 'react';

export const LanguageContext = createContext();

async function processOutputLanguage(outputLanguage, setOutputTranslator) {
    console.log("outputLanguage to process", outputLanguage);
    const languagePair = {
        sourceLanguage: 'en',
        targetLanguage: outputLanguage,
    };
    try {
        const canTranslate = await window.translation.canTranslate(languagePair);
        if (canTranslate !== 'no') {
            if (canTranslate === 'readily') {
                const outputTranslator = await window.translation.createTranslator(languagePair);
                setOutputTranslator(outputTranslator);
                return outputTranslator;
            } else {
                let translator = await window.translation.createTranslator(languagePair);
                translator.addEventListener('downloadprogress', (e) => {
                    console.log(e.loaded, e.total);
                });
                await translator.ready;
                return translator;
            }
        } else {
            console.log("The Output translator can't be used at all.");
            return null;
        }
    } catch (error) {
        console.log(error, "error in process output Language");
    }

}

async function processInputLanguage(inputLanguage, setInputTranslator) {
    try {
        const languagePair = {
            sourceLanguage: inputLanguage,
            targetLanguage: 'en',
        };

        const canTranslate = await window.translation.canTranslate(languagePair);
        if (canTranslate !== 'no') {
            if (canTranslate === 'readily') {
                const inputTranslator = await window.translation.createTranslator(languagePair);
                setInputTranslator(inputTranslator);
                return inputTranslator;
            } else {
                let translator = await window.translation.createTranslator(languagePair);
                translator.addEventListener('downloadprogress', (e) => {
                    console.log(e.loaded, e.total);
                });
                await translator.ready;
                return translator;
            }
        } else {
            console.log("The translator can't be used at all.");
            return null;
        }
    } catch (error) {
        console.log(error, "error in processInputLanguage")
    }
}

export const LanguageProvider = ({ children }) => {
    const [inputLanguage, setInputLanguage] = useState('en');
    const [outputLanguage, setOutputLanguage] = useState('en');
    const [inputTranslator, setInputTranslator] = useState(null);
    const [outputTranslator, setOutputTranslator] = useState(null);
    const [currentOutputLanguage, setCurrentOutputLanguage] = useState(null);

    async function convertInputText(inputText, inputlang) {
        let translator = inputTranslator;
        if (inputLanguage != inputlang) {
            setInputLanguage(inputlang);
            translator = await processInputLanguage(inputlang, setInputTranslator);
        }
        if (translator) {
            const translation = await translator.translate(inputText);
            console.log("translation ", translation);
            return translation;
        } else {
            return "";
        }
    }

    async function convertOutputText(outputText) {
        if (outputLanguage == 'en') return outputText;
        let translator = outputTranslator;
        if (outputLanguage != currentOutputLanguage) {
            setCurrentOutputLanguage(outputLanguage);
            translator = await processOutputLanguage(outputLanguage, setOutputTranslator);
        }
        if (translator) {
            const translation = await translator.translate(outputText);
            return translation;
        } else {
            return "";
        }
    }
    const updateOutputLanguage = (outputLang) => {
        setOutputLanguage(outputLang);
    }
    const getOutputLanguage = () => {
        return outputLanguage;
    }
    const getInputLanguage = () => {
        return inputLanguage;
    }

    return (
        <LanguageContext.Provider value={{
            convertInputText,
            convertOutputText,
            updateOutputLanguage,
            getOutputLanguage,
            getInputLanguage
        }}>
            {children}
        </LanguageContext.Provider>
    );
};
