/* global chrome */

import React, { createContext, useEffect, useState, useCallback } from 'react';

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

    const convertInputText = useCallback(async (inputText, inputlang) => {
        let translator = inputTranslator;
        if (inputLanguage !== inputlang) {
            setInputLanguage(inputlang);
            translator = await processInputLanguage(inputlang, setInputTranslator);
        }
        if (translator) {
            const translation = await translator.translate(inputText);
            console.log("translation ", translation);
            return translation;
        }
        return "";
    }, [inputLanguage, inputTranslator]);

    useEffect(() => {
        console.log('current Output Lanuage ', outputLanguage);
    }, [outputLanguage]);

    const convertOutputText = useCallback(async (outputText) => {
        const currentLang = outputLanguage;

        if (currentLang === 'en') return outputText;

        let translator = outputTranslator;
        if (currentLang !== currentOutputLanguage) {
            setCurrentOutputLanguage(currentLang);
            translator = await processOutputLanguage(currentLang, setOutputTranslator);
        }

        if (translator) {
            const translation = await translator.translate(outputText);
            return translation;
        }
        return "";
    }, [outputLanguage, outputTranslator, currentOutputLanguage]);

    const updateOutputLanguage = useCallback((outputLang) => {
        setOutputLanguage(outputLang);
        setCurrentOutputLanguage(null);
        setOutputTranslator(null);
    }, []);

    const getOutputLanguage = useCallback(() => {
        return outputLanguage;
    }, [outputLanguage]);

    const getInputLanguage = useCallback(() => {
        return inputLanguage;
    }, [inputLanguage]);

    const contextValue = {
        convertInputText,
        convertOutputText,
        updateOutputLanguage,
        getOutputLanguage,
        getInputLanguage,
        outputLanguage
    };

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
};