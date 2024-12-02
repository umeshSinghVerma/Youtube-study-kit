/* global chrome */

export async function getData(key) {
    let data = null;
    try {
        const result = await chrome.storage.local.get(key);
        data = result[key];
        console.log("this is the data ",data);
    } catch (error) {
        console.log(error);
    } finally {
        return data;
    }
}