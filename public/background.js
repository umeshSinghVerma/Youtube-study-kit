chrome.runtime.onInstalled.addListener(() => {
    const guideURL = chrome.runtime.getURL("index.html#/guide");
    chrome.tabs.create({ url: guideURL });
});

chrome.runtime.setUninstallURL('https://frametagger.com');