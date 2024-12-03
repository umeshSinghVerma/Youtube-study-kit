chrome.runtime.onInstalled.addListener(() => {
    // const guideURL = chrome.runtime.getURL("index.html#/guide");
    const guideURL = "https://youtube-study-kit.vercel.app/";
    chrome.tabs.create({ url: guideURL });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "create_tab") {
      const guideURL = chrome.runtime.getURL(message.url);
      chrome.tabs.create({ url: guideURL });
      sendResponse({ success: true });
    }
  });
  

chrome.runtime.setUninstallURL('https://Youtube Study Kit.com');