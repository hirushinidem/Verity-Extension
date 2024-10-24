chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("action ", request.action);
  if (request.action === "fakeImageDetection") {
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //   chrome.scripting.executeScript({
    //     target: { tabId: tabs[0].id },
    //     files: ["src/fake_image_content.js"],
    //   });
    // });
    console.log("fakeImageDetection");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(
          activeTab.id,
          { action: "startFakeImageDetection" },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Runtime error:", chrome.runtime.lastError);
            } else {
              console.log("Response received:", response);
            }
          }
        );
      } else {
        console.warn("No active tab found.");
      }
    });
  } else if (request.action === "politicalMisinfoDetection") {
    // Run the background process for political misinformation detection
    console.log("Political Misinfo Detection triggered");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(
          activeTab.id,
          { action: "startPoliticalMisinfo" },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Runtime error:", chrome.runtime.lastError);
            } else {
              console.log("Response received:", response);
            }
          }
        );
      } else {
        console.warn("No active tab found.");
      }
    });
  } else if (request.action === "botDetection") {
    // Run the background process for bot detection
    console.log("Bot Detection triggered");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(
          activeTab.id,
          { action: "startBotDetection" },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Runtime error:", chrome.runtime.lastError);
            } else {
              console.log("Response received:", response);
            }
          }
        );
      } else {
        console.warn("No active tab found.");
      }
    });
  } else if (request.action === "clickbaitDetection") {
    // Run the background process for clickbait detection
    console.log("Clickbait Detection triggered");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(
          activeTab.id,
          { action: "startClickbaitDetection" },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Runtime error:", chrome.runtime.lastError);
            } else {
              console.log("Response received:", response);
            }
          }
        );
      } else {
        console.warn("No active tab found.");
      }
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openNews") {
    chrome.windows.create({
      url: chrome.runtime.getURL("src/news/news.html"), // Path to your popup HTML
      type: "popup",
      width: 600,
      height: 400,
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "fetchNews") {
    fetchNews(request.news).then(sendResponse);
    return true; // Keep the message channel open for sendResponse
  }
});

async function fetchNews(news) {
  const apiKey = "8c9864109e684fca9a793347b16019f2";
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        news
      )}&sortBy=popularity&apiKey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    return data.articles.slice(0, 2).map((article) => article.url);
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}
