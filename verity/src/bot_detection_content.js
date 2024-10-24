// Set to store already processed tweet URLs
botTweet = null;
botTweet = new Set();

// Function to get all visible tweets and user details
function getVisibleTweetsForBotDetection() {
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

    if (inViewport && !botTweet.has(tweet)) {
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
        botTweet.add(tweet); // Add tweet to the set to avoid duplicate processing
      }
    }
  });

  return tweetData;
}

// Function to send tweet data to your API
function sendTweetDataBotToAPI(tweets) {
  if (tweets.length > 0) {
    console.log(tweets);

    tweets.forEach((tweet) => {
      description = tweet.description;
      fetch("http://127.0.0.1:8000/bot-detection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("API Response:", data);
          displayRelevantBotTweet({ description, ...data });
          incrementCount("bot_count");
          if (data.prediction.confidence > 0.5)
            incrementCount("bot_detect_count");
        })
        .catch((error) => console.error("Error:", error));
    });
  }
}

// Function to handle tweet detection and API sending
function handleTweetDetectionForBot() {
  const tweetData = getVisibleTweetsForBotDetection();
  if (tweetData.length > 0) {
    sendTweetDataBotToAPI(tweetData);
    // displayRelevantTweets(tweetData); // Display tweets related to the data
  }
}

// Function to display relevant tweets near the actual tweets
function displayRelevantTweets(data) {
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

// function displayRelevantBotTweet(data) {
//   // Create a container for each tweet
//   console.log(data);
//   const tweetContainer = document.createElement("div");
//   tweetContainer.classList.add("tweet-container");
//   tweetContainer.style.position = "absolute";
//   tweetContainer.style.backgroundColor = "white";
//   tweetContainer.style.border = "1px solid black";
//   tweetContainer.style.padding = "5px";
//   tweetContainer.style.zIndex = 10000;
//   tweetContainer.style.width = "200px";

//   // Create and append the tweet description to the container
//   // const tweetText = document.createElement("p");
//   // tweetText.innerText = data.prediction.confidence;
//   // tweetContainer.appendChild(tweetText);

//   // Create and append the progress bar to the container
//   const progressBarContainer = document.createElement("div");
//   progressBarContainer.style.height = "10px";
//   progressBarContainer.style.backgroundColor = "#f3f3f3";
//   progressBarContainer.style.border = "1px solid #ddd";
//   progressBarContainer.style.marginTop = "5px";

//   const progressBar = document.createElement("div");
//   progressBar.style.height = "100%";
//   progressBar.style.width = "0%"; // Initially set to 0%
//   progressBar.style.backgroundColor = "#4caf50";
//   if (data.prediction.confidence > 0.5) {
//     progressBar.style.backgroundColor = "#dc2626";
//   }

//   // Append progress bar to the progress bar container
//   progressBarContainer.appendChild(progressBar);

//   // Create and append the percentage text
//   const percentageText = document.createElement("div");
//   percentageText.style.fontSize = "18px";
//   percentageText.style.color = "#333";
//   percentageText.style.textAlign = "center";
//   percentageText.textContent = "0%";
//   percentageText.style.marginTop = "5px";

//   tweetContainer.appendChild(progressBarContainer);
//   tweetContainer.appendChild(percentageText);

//   // Find the corresponding real tweet on the page
//   const realTweet = Array.from(document.querySelectorAll("article")).find(
//     (article) =>
//       article.querySelector('[data-testid="tweetText"]')?.innerText ===
//       data.description
//   );

//   // if (realTweet) {
//   //   const rect = realTweet.getBoundingClientRect();
//   //   tweetContainer.style.top = `${rect.top + window.scrollY}px`;
//   //   tweetContainer.style.left = `${rect.right + window.scrollX}px`;
//   //   // tweetContainer.style.top = `${rect.bottom + window.scrollY}px`;
//   //   // tweetContainer.style.left = `${rect.left + window.scrollX}px`;

//   //   // Append the container to the body
//   //   document.body.appendChild(tweetContainer);

//   //   // Update the progress bar (simulating progress here)
//   //   let progress = 0;
//   //   const interval = setInterval(() => {
//   //     if (progress >= data.prediction.confidence * 100) {
//   //       clearInterval(interval);
//   //     } else {
//   //       progress += 1; // Increment progress
//   //       progressBar.style.width = `${progress}%`;
//   //       percentageText.textContent = `Bot: ${progress}%`;
//   //     }
//   //   }, 5);
//   // }

//   if (realTweet) {
//     // Get the tweet text element
//     const tweetTextElement = realTweet.querySelector(
//       '[data-testid="tweetText"]'
//     );

//     if (tweetTextElement) {
//       const rect = tweetTextElement.getBoundingClientRect();

//       // Position the tweetContainer below the tweet text element
//       tweetContainer.style.position = "absolute";
//       tweetContainer.style.top = `${rect.bottom + window.scrollY}px`; // 10px margin below the text
//       tweetContainer.style.left = `${rect.left + window.scrollX}px`;

//       // Append the container to the body
//       document.body.appendChild(tweetContainer);

//       // Update the progress bar (simulating progress here)
//       let progress = 0;
//       const interval = setInterval(() => {
//         if (progress >= data.prediction.confidence * 100) {
//           clearInterval(interval);
//         } else {
//           progress += 1; // Increment progress
//           progressBar.style.width = `${progress}%`;
//           percentageText.textContent = `Bot Detection: ${progress}%`;
//         }
//       }, 5);
//     }
//   }
// }

function displayRelevantBotTweet(data) {
  // Log the data for debugging
  console.log(data);

  // Check if a tweet container already exists and remove it
  // const existingContainer = document.querySelector(".tweet-container");
  // if (existingContainer) {
  //   existingContainer.remove();
  // }

  // Create a new container for each tweet
  const tweetContainer = document.createElement("div");
  tweetContainer.classList.add("tweet-container");
  tweetContainer.style.position = "absolute";
  tweetContainer.style.backgroundColor = "white";
  tweetContainer.style.border = "1px solid black";
  tweetContainer.style.padding = "5px";
  tweetContainer.style.zIndex = 10000;
  tweetContainer.style.width = "200px";

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

  // Find the corresponding real tweet on the page
  const realTweet = Array.from(document.querySelectorAll("article")).find(
    (article) =>
      article.querySelector('[data-testid="tweetText"]')?.innerText ===
      data.description
  );

  if (realTweet) {
    const tweetTextElement = realTweet.querySelector(
      '[data-testid="tweetText"]'
    );

    if (tweetTextElement) {
      // tweetTextElement.remove();
      const rect = tweetTextElement.getBoundingClientRect();

      // Position the tweetContainer below the tweet text element
      tweetContainer.style.top = `${rect.bottom + window.scrollY}px`; // 10px margin below the text
      tweetContainer.style.left = `${rect.left + window.scrollX}px`;

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
          percentageText.textContent = `Bot Detection: ${progress}%`;
        }
      }, 5);
    }
  }
}

// Intersection Observer and Mutation Observer to detect visibility changes
// let observer2 = null;
// let observerForNewTweets2 = null;
// function startBotDetection() {
//   observer2 = new IntersectionObserver(
//     (entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           handleTweetDetectionForBot();
//         }
//       });
//     },
//     {
//       root: null, // Use the viewport as the root
//       rootMargin: "0px",
//       threshold: 0.1, // Trigger when 10% of the tweet is visible
//     }
//   );

//   // Observe all tweets
//   const tweets = document.querySelectorAll("article");
//   tweets.forEach((tweet) => observer2.observe(tweet));

//   // Detect dynamically added tweets
//   observerForNewTweets2 = new MutationObserver(() => {
//     const newTweets = document.querySelectorAll("article:not([data-observed])");
//     newTweets.forEach((tweet) => {
//       observer2.observe(tweet);
//       tweet.setAttribute("data-observed", "true"); // Mark as observed
//     });
//   });

//   observerForNewTweets2.observe(document.body, {
//     childList: true,
//     subtree: true,
//   });
// }

let observer2 = null;
let observerForNewTweets2 = null;

function startBotDetection() {
  observer2 = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          handleTweetDetectionForBot();
        }
      });
    },
    {
      root: null, // Use the viewport as the root
      rootMargin: "0px",
      threshold: 0.1, // Trigger when 10% of the tweet is visible
    }
  );

  // Observe all tweets initially
  const tweets = document.querySelectorAll("article");
  tweets.forEach((tweet) => {
    observer2.observe(tweet);
    tweet.setAttribute("data-observed", "true"); // Mark as observed
  });

  // Detect dynamically added tweets
  observerForNewTweets2 = new MutationObserver(() => {
    const newTweets = document.querySelectorAll("article:not([data-observed])");
    newTweets.forEach((tweet) => {
      observer2.observe(tweet);
      tweet.setAttribute("data-observed", "true"); // Mark as observed
    });
  });

  observerForNewTweets2.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function stopBotDetection() {
  removeAllTweetContainers();
  // Disconnect the IntersectionObserver
  if (observer2) {
    observer2.disconnect();
    observer2 = null;
  }

  // Disconnect the MutationObserver
  if (observerForNewTweets2) {
    observerForNewTweets2.disconnect();
    observerForNewTweets2 = null;
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
  if (botTweet) {
    botTweet.clear();
  }

  console.log("Fake tweet detection stopped");
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in content script", request.action);
  if (request.action === "startBotDetection") {
    if (observer2 || observerForNewTweets2) {
      stopBotDetection();
      sendResponse({ status: "Bot detection stopped" });
    } else {
      startBotDetection();
      sendResponse({ status: "Bot detection executed" });
    }
  }
});

function removeAllTweetContainers() {
  const containers = document.querySelectorAll(".tweet-container");
  containers.forEach((container) => container.remove());
}
