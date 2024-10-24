// Set to store already processed tweet URLs
politicalTweet = null;
politicalTweet = new Set();

// Function to get all visible tweets and user details
function getVisibleTweetsForPoliticalMisinfo() {
  const tweets = document.querySelectorAll("article"); // Assuming each tweet is in an <article> element
  const tweetData = [];

  tweets.forEach((tweet) => {
    const rect = tweet.getBoundingClientRect();
    const inViewport =
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth);

    if (inViewport && !politicalTweet.has(tweet)) {
      const tweetDescription =
        tweet.querySelector('[data-testid="tweetText"]')?.innerText ||
        "No tweet text found";
      const userName =
        tweet.querySelector('[data-testid="User-Name"] span')?.innerText ||
        "No user name found";
      const userHandle =
        tweet.querySelector('[data-testid="User-Names"] a')?.innerText ||
        "No handle found";

      if (tweetDescription && userName && userHandle) {
        tweetData.push({
          description: tweetDescription,
          user: { name: userName, handle: userHandle },
        });
        politicalTweet.add(tweet); // Add tweet to the set to avoid duplicate processing
      }
    }
  });

  return tweetData;
}

// Function to send tweet data to your API
function sendTweetDataForPoliticalToAPI(tweets) {
  if (tweets.length > 0) {
    console.log(tweets);

    tweets.forEach((tweet) => {
      description = tweet.description;
      fetch("http://127.0.0.1:8000/political-misinfo-detection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("API Response:", data);
          displayRelevantPoliticalTweet({ description, ...data });
          incrementCount("political_count");
          if (data.prediction.confidence > 0.5)
            incrementCount("political_detect_count");
        })
        .catch((error) => console.error("Error:", error));
    });
  }
}

// Function to handle tweet detection and API sending
function handleTweetDetectionForPolitical() {
  const tweetData = getVisibleTweetsForPoliticalMisinfo();
  if (tweetData.length > 0) {
    // sendTweetDataForPoliticalToAPI(tweetData);
    displayRelevantPoliticalTweetClick(tweetData);
    // displayRelevantPoliticalTweets(tweetData); // Display tweets related to the data
  }
}

// Function to display relevant tweets near the actual tweets
function displayRelevantPoliticalTweets(data) {
  data.forEach((tweet) => {
    // Create a container for each tweet
    const tweetContainer = document.createElement("div");
    tweetContainer.style.position = "absolute";
    tweetContainer.style.backgroundColor = "white";
    tweetContainer.style.border = "1px solid black";
    tweetContainer.style.padding = "5px";
    tweetContainer.style.zIndex = 10000;
    tweetContainer.style.maxWidth = "200px"; // Adjust width for readability

    // Create and append the tweet description to the container
    const tweetText = document.createElement("p");
    tweetText.innerText = tweet.description;
    tweetContainer.appendChild(tweetText);

    // Create and append the user details to the container
    const userInfo = document.createElement("p");
    userInfo.innerHTML = `<strong>${tweet.user.name}</strong> (${tweet.user.handle})`;
    tweetContainer.appendChild(userInfo);

    // Find the corresponding real tweet on the page
    const realTweet = Array.from(document.querySelectorAll("article")).find(
      (article) =>
        article.querySelector('[data-testid="tweetText"]')?.innerText ===
        tweet.description
    );

    if (realTweet) {
      const rect = realTweet.getBoundingClientRect();
      tweetContainer.style.top = `${rect.top + window.scrollY}px`;
      tweetContainer.style.left = `${rect.right + window.scrollX}px`;

      // Append the container to the body
      document.body.appendChild(tweetContainer);
    }
  });
}

// function displayRelevantPoliticalTweetClick(tweetData) {
//   tweetData.forEach((data) => {
//     // Create a container for each tweet
//     console.log(data);
//     const tweetContainer = document.createElement("div");
//     tweetContainer.style.position = "absolute";
//     tweetContainer.style.backgroundColor = "white";
//     tweetContainer.style.border = "1px solid black";
//     tweetContainer.style.padding = "5px";
//     tweetContainer.style.zIndex = 10000;
//     tweetContainer.style.width = "200px";

//     // Create and append a button to the container
//     const button = document.createElement("button");
//     button.textContent = "Latest News";
//     button.style.marginTop = "10px";
//     button.style.padding = "5px 10px";
//     button.style.backgroundColor = "#007bff";
//     button.style.color = "white";
//     button.style.border = "none";
//     button.style.borderRadius = "5px";
//     button.style.cursor = "pointer";

//     button.addEventListener("click", () => {
//       // Send a message to the background script
//       console.log("click button");
//       sendTweetDataForPoliticalToAPI(tweetData);
//     });
//     const container = document.createElement("div");
//     container.style.textAlign = "center";
//     container.appendChild(button);
//     tweetContainer.appendChild(container);

//     // Find the corresponding real tweet on the page
//     const realTweet = Array.from(document.querySelectorAll("article")).find(
//       (article) =>
//         article.querySelector('[data-testid="tweetText"]')?.innerText ===
//         data.description
//     );

//     if (realTweet) {
//       const rect = realTweet.getBoundingClientRect();
//       tweetContainer.style.top = `${rect.top + window.scrollY}px`;
//       tweetContainer.style.left = `${rect.right + window.scrollX}px`;

//       // Append the container to the body
//       document.body.appendChild(tweetContainer);
//     }
//   });
// }

function displayRelevantPoliticalTweetClick(tweetData) {
  tweetData.forEach((data) => {
    // Create a container for each tweet
    console.log(data);
    const tweetContainer = document.createElement("div");
    tweetContainer.style.position = "absolute";
    tweetContainer.style.backgroundColor = "transparent";
    tweetContainer.style.zIndex = 10000;

    // Create and append an icon to the container
    const icon = document.createElement("img");
    icon.src = chrome.runtime.getURL("assets/home/info.png"); // Replace with your icon path or use an icon font
    icon.alt = "Latest News";
    icon.style.width = "24px"; // Set icon size
    icon.style.height = "24px"; // Set icon size
    icon.style.cursor = "pointer";
    icon.style.marginTop = "10px";
    icon.title = "Political Misinfo";

    icon.addEventListener("click", () => {
      // Send a message to the background script
      console.log("icon clicked");
      sendTweetDataForPoliticalToAPI(tweetData);
      // Remove the tweetContainer from the DOM
      tweetContainer.remove();
    });

    const container = document.createElement("div");
    container.style.textAlign = "center";
    container.appendChild(icon);
    tweetContainer.appendChild(container);

    // Find the corresponding real tweet on the page
    const realTweet = Array.from(document.querySelectorAll("article")).find(
      (article) =>
        article.querySelector('[data-testid="tweetText"]')?.innerText ===
        data.description
    );

    if (realTweet) {
      const rect = realTweet.getBoundingClientRect();
      tweetContainer.style.top = `${rect.top + window.scrollY}px`;
      tweetContainer.style.left = `${rect.right + window.scrollX}px`;

      // Append the container to the body
      document.body.appendChild(tweetContainer);
    }
  });
}

async function displayRelevantPoliticalTweet(data) {
  // Create a container for each tweet
  console.log(data);
  const tweetContainer = document.createElement("div");
  tweetContainer.style.position = "absolute";
  tweetContainer.style.backgroundColor = "white";
  tweetContainer.style.border = "1px solid black";
  tweetContainer.style.padding = "5px";
  tweetContainer.style.zIndex = 10000;
  tweetContainer.style.width = "200px";

  // Create and append the tweet description to the container
  // const tweetText = document.createElement("p");
  // tweetText.innerText = data.prediction.confidence;
  // tweetContainer.appendChild(tweetText);

  // Create and append the progress bar to the container
  const progressBarContainer = document.createElement("div");
  progressBarContainer.style.height = "10px";
  progressBarContainer.style.backgroundColor = "#f3f3f3";
  progressBarContainer.style.border = "1px solid #ddd";
  progressBarContainer.style.marginTop = "5px";

  const progressBar = document.createElement("div");
  progressBar.style.height = "100%";
  progressBar.style.width = "0%"; // Initially set to 0%
  progressBar.style.backgroundColor = "#4caf50";
  if (data.prediction.confidence > 0.5) {
    progressBar.style.backgroundColor = "#dc2626";
  }

  // Append progress bar to the progress bar container
  progressBarContainer.appendChild(progressBar);

  // Create and append the percentage text
  const percentageText = document.createElement("div");
  percentageText.style.fontSize = "18px";
  percentageText.style.color = "#333";
  percentageText.style.textAlign = "center";
  percentageText.textContent = "0%";
  percentageText.style.marginTop = "5px";

  tweetContainer.appendChild(progressBarContainer);
  tweetContainer.appendChild(percentageText);

  // Create and append a button to the container
  const button = document.createElement("button");
  button.textContent = "Latest News";
  button.style.marginTop = "10px";
  button.style.padding = "5px 10px";
  button.style.backgroundColor = "#007bff";
  button.style.color = "white";
  button.style.border = "none";
  button.style.borderRadius = "5px";
  button.style.cursor = "pointer";

  // button.addEventListener("click", () => {
  //   // Open the popup window with another HTML file
  //   const popupUrl = "./news/news.html"; // Path to your HTML file
  //   const popupWindow = window.open(
  //     popupUrl,
  //     "popupWindow",
  //     "width=600,height=400,scrollbars=yes,resizable=yes"
  //   );

  //   if (popupWindow) {
  //     popupWindow.focus();
  //   }
  // });

  button.addEventListener("click", () => {
    // Send a message to the background script
    chrome.runtime.sendMessage({ action: "openNews" });
  });
  const container = document.createElement("div");
  container.style.textAlign = "center";
  container.appendChild(button);
  tweetContainer.appendChild(container);

  // Create a container for the URLs
  const urlListContainer = document.createElement("div");
  urlListContainer.style.marginTop = "10px";
  urlListContainer.style.textAlign = "left"; // Align text to the left
  // urls = await suggestNews(data.description);
  // console.log(urls);
  // Add URLs to the list

  chrome.runtime.sendMessage(
    { type: "fetchNews", news: data.description },
    (urls) => {
      if (urls.length != 0) {
        urls.forEach((url) => {
          const urlItem = document.createElement("div");
          urlItem.style.display = "flex";
          urlItem.style.flexDirection = "coulmns";
          urlItem.style.justifyContent = "center";
          urlItem.style.alignItems = "center";
          const link = document.createElement("a");
          link.href = url;
          link.target = "_blank"; // Open in a new tab
          link.textContent = url.length > 20 ? url.slice(0, 25) + "..." : url;
          link.style.color = "#007bff"; // Link color
          link.style.textDecoration = "underline"; // Underline the link

          urlItem.appendChild(link);
          urlListContainer.appendChild(urlItem);
        });

        tweetContainer.appendChild(urlListContainer);
      }
    }
  );

  // Find the corresponding real tweet on the page
  const realTweet = Array.from(document.querySelectorAll("article")).find(
    (article) =>
      article.querySelector('[data-testid="tweetText"]')?.innerText ===
      data.description
  );

  if (realTweet) {
    const rect = realTweet.getBoundingClientRect();
    tweetContainer.style.top = `${rect.top + window.scrollY}px`;
    tweetContainer.style.left = `${rect.right + window.scrollX}px`;

    // Append the container to the body
    document.body.appendChild(tweetContainer);

    // Update the progress bar (simulating progress here)
    let progress = 0;
    const interval = setInterval(() => {
      if (progress >= data.prediction.confidence * 100) {
        clearInterval(interval);
      } else {
        progress += 1; // Increment progress
        progressBar.style.width = `${progress}%`;
        percentageText.textContent = `Political Misinfo: ${progress}%`;
      }
    }, 5);
  }
}

// Intersection Observer and Mutation Observer to detect visibility changes
let observer1 = null;
let observerForNewTweets1 = null;
function startPoliticalDetection() {
  observer1 = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          handleTweetDetectionForPolitical();
        }
      });
    },
    {
      root: null, // Use the viewport as the root
      rootMargin: "0px",
      threshold: 0.1, // Trigger when 10% of the tweet is visible
    }
  );

  // Observe all tweets
  const tweets = document.querySelectorAll("article");
  tweets.forEach((tweet) => observer1.observe(tweet));

  // Detect dynamically added tweets
  observerForNewTweets1 = new MutationObserver(() => {
    const newTweets = document.querySelectorAll("article:not([data-observed])");
    newTweets.forEach((tweet) => {
      observer1.observe(tweet);
      tweet.setAttribute("data-observed", "true"); // Mark as observed
    });
  });

  observerForNewTweets1.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function stopPoliticalDetection() {
  // Disconnect the IntersectionObserver
  if (observer1) {
    observer1.disconnect();
    observer1 = null;
  }

  // Disconnect the MutationObserver
  if (observerForNewTweets1) {
    observerForNewTweets1.disconnect();
    observerForNewTweets1 = null;
  }

  // Optionally clean up any DOM changes made by the script
  const tweetContainers = document.querySelectorAll(
    "div[data-tweet-container]"
  );
  tweetContainers.forEach((container) => container.remove());

  // Remove 'data-observed' attribute from tweets
  const observedTweets = document.querySelectorAll("article[data-observed]");
  observedTweets.forEach((tweet) => tweet.removeAttribute("data-observed"));

  // Optionally clear processed tweet URLs if needed
  if (politicalTweet) {
    politicalTweet.clear();
  }

  console.log("Fake tweet detection stopped");
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in content script", request.action);
  if (request.action === "startPoliticalMisinfo") {
    if (observer1 || observerForNewTweets1) {
      stopPoliticalDetection();
      removeAllTweetContainers();
      sendResponse({ status: "Political Misinfo detection stopped" });
    } else {
      startPoliticalDetection();
      sendResponse({ status: "Political Misinfo detection executed" });
    }
  }
});
