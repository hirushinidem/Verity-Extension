document.getElementById("fake-image").addEventListener("click", () => {
  //   chrome.runtime.sendMessage({ action: "fakeImageDetection" });
  //   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //     chrome.scripting.executeScript({
  //       target: { tabId: tabs[0].id },
  //       files: ["src/content.js"],
  //     });
  //   });
  console.log("fake-image");
  chrome.runtime.sendMessage({ action: "fakeImageDetection" });
});

document.getElementById("political-misinfo").addEventListener("click", () => {
  console.log("political-misinfo");
  chrome.runtime.sendMessage({ action: "politicalMisinfoDetection" });
});

document.getElementById("bot-detection").addEventListener("click", () => {
  console.log("bot-detection");
  chrome.runtime.sendMessage({ action: "botDetection" });
});

document.getElementById("clickbait-detection").addEventListener("click", () => {
  console.log("clickbait-detection");
  chrome.runtime.sendMessage({ action: "clickbaitDetection" });
});
