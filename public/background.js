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
      return;
    }

    if (message.type === "PROMPT_GEMINI") {
      (async () => {
        try {
          const session = await LanguageModel.create({
            initialPrompts: [{ role: "system", content: message.initialPrompts }],
          });
          const keywords = await session.prompt(message.prompt);
          session.destroy();
          sendResponse({ ok: true, keywords });
        } catch (e) {
          sendResponse({ ok: false, error: String(e) });
        }
      })();
      return true;
    }
  });

chrome.runtime.setUninstallURL('https://youtube-study-kit.vercel.app/');