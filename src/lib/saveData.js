/* global chrome */

export async function saveData(key, value, setValue) {
    try {
        chrome.storage.local.set({ [key]: value }).then(() => {
            setValue(value);
            console.log(key,value, "value is set");
        }).catch((e) => {
            console.log(e)
        })
    } catch (error) {
        console.log(error)
    }
}

