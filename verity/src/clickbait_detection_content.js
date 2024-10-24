// Set to store already processed tweet URLs
clickbaitTweet = null;
clickbaitTweet = new Set();

// Function to get all visible tweets and user details
// function getVisibleTweetsForClickbaitDetection() {
//   const tweets = document.querySelectorAll("article"); // Assuming each tweet is in an <article> element
//   const tweetData = [];

//   tweets.forEach((tweet) => {
//     const rect = tweet.getBoundingClientRect();
//     const inViewport =
//       rect.top >= 0 &&
//       rect.left >= 0 &&
//       rect.bottom <=
//         (window.innerHeight || document.documentElement.clientHeight) &&
//       rect.right <= (window.innerWidth || document.documentElement.clientWidth);

//     if (inViewport && !clickbaitTweet.has(tweet)) {
//       const tweetDescription =
//         tweet.querySelector('[data-testid="tweetText"]')?.innerText ||
//         "No tweet text found";
//       const userName =
//         tweet.querySelector('[data-testid="User-Name"] span')?.innerText ||
//         "No user name found";
//       const userHandle =
//         tweet.querySelector('[data-testid="User-Names"] a')?.innerText ||
//         "No handle found";

//       if (tweetDescription && userName && userHandle) {
//         tweetData.push({
//           description: tweetDescription,
//           user: { name: userName, handle: userHandle },
//         });
//         clickbaitTweet.add(tweet); // Add tweet to the set to avoid duplicate processing
//       }
//     }
//   });

//   return tweetData;
// }

function getVisibleTweetsForClickbaitDetection() {
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

    if (inViewport && !clickbaitTweet.has(tweet)) {
      const tweetDescription =
        tweet.querySelector('[data-testid="tweetText"]')?.innerText ||
        "No tweet text found";
      const userName =
        tweet.querySelector('[data-testid="User-Name"] span')?.innerText ||
        "No user name found";
      const userHandle =
        tweet.querySelector('[data-testid="User-Names"] a')?.innerText ||
        "No handle found";
      // const link = tweet.querySelector("a"); // Assuming you want the first anchor tag found
      const link = tweet
        .querySelector('[data-testid="tweetText"]')
        .querySelector("a");
      console.log(link);
      // const linkHref = link?.href || "No link found";
      // const linkText = link?.innerText || "No link text found";
      const linkHref = link?.href || "No link found";
      const linkText = link?.innerText;

      if (linkText) {
        console.log("link find =========================", linkText);
        tweetData.push({
          description: tweetDescription,
          user: { name: userName, handle: userHandle },
          link: { href: linkHref, text: linkText },
        });
        clickbaitTweet.add(tweet); // Add tweet to the set to avoid duplicate processing
      }
    }
  });

  return tweetData;
}

// Function to send tweet data to your API
function sendTweetDataForClickbaitToAPI(tweets) {
  if (tweets.length > 0) {
    console.log(tweets);

    tweets.forEach((tweet) => {
      title = tweet.link.text;
      description = tweet.description;
      fetch("http://127.0.0.1:8000/clickbait-detection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("API Response:", data);
          displayRelevantClickbaitTweet({ description, title, ...data });
          incrementCount("clickbait_count");
          if (data.prediction.confidence > 0.5)
            incrementCount("clickbait_detect_count");
        })
        .catch((error) => console.error("Error:", error));
    });
  }
}

// Function to handle tweet detection and API sending
function handleTweetDetectionForClickbait() {
  const tweetData = getVisibleTweetsForClickbaitDetection();
  if (tweetData.length > 0) {
    sendTweetDataForClickbaitToAPI(tweetData);
    // displayRelevantClickbaitTweets(tweetData); // Display tweets related to the data
  }
}

function displayRelevantClickbaitTweet(data) {
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

  // Find the corresponding real tweet on the page
  // const realTweet = Array.from(document.querySelectorAll("article")).find(
  //   (article) =>
  //     article.querySelector('[data-testid="tweetText"]')?.innerText ===
  //     data.description
  // );

  // const realTweet = Array.from(document.querySelectorAll("article")).find(
  //   (article) =>
  //     Array.from(article.querySelectorAll('[data-testid="tweetText"]')).some(
  //       (a) => a.querySelector("a")?.innerText === data.title
  //     )
  // );

  const realTweet = Array.from(document.querySelectorAll("article")).find(
    (article) =>
      Array.from(article.querySelectorAll('[data-testid="tweetText"]')).some(
        (a) => a.querySelector("a")?.innerText === data.title
      )
  );

  // if (realTweet) {
  //   const rect = realTweet.getBoundingClientRect();
  //   tweetContainer.style.top = `${rect.top + window.scrollY}px`;
  //   tweetContainer.style.left = `${rect.right + window.scrollX}px`;

  //   // Append the container to the body
  //   document.body.appendChild(tweetContainer);

  //   // Update the progress bar (simulating progress here)
  //   let progress = 0;
  //   const interval = setInterval(() => {
  //     if (progress >= data.prediction.confidence * 100) {
  //       clearInterval(interval);
  //     } else {
  //       progress += 1; // Increment progress
  //       progressBar.style.width = `${progress}%`;
  //       percentageText.textContent = `Clickbait: ${progress}%`;
  //     }
  //   }, 5);
  // }

  if (realTweet) {
    // Find the specific link within the realTweet
    const link = Array.from(realTweet.querySelectorAll("a")).find(
      (a) => a.innerText === data.title
    );

    if (link) {
      const rect = link.getBoundingClientRect(); // Get the position of the link
      tweetContainer.style.top = `${rect.top + window.scrollY + 20}px`; // Position at the top of the link
      tweetContainer.style.left = `${rect.right + window.scrollX}px`; // Position next to the right of the link

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
          percentageText.textContent = `Clickbait: ${progress}%`;
        }
      }, 5);
    }
  }
}

// Function to display relevant tweets near the actual tweets
function displayRelevantClickbaitTweets(data) {
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

// Intersection Observer and Mutation Observer to detect visibility changes
let observer3 = null;
let observerForNewTweets3 = null;
function startClickbaitDetection() {
  observer3 = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          handleTweetDetectionForClickbait();
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
  tweets.forEach((tweet) => observer3.observe(tweet));

  // Detect dynamically added tweets
  observerForNewTweets3 = new MutationObserver(() => {
    const newTweets = document.querySelectorAll("article:not([data-observed])");
    newTweets.forEach((tweet) => {
      observer3.observe(tweet);
      tweet.setAttribute("data-observed", "true"); // Mark as observed
    });
  });

  observerForNewTweets3.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function stopClickbaitDetection() {
  // Disconnect the IntersectionObserver
  if (observer3) {
    observer3.disconnect();
    observer3 = null;
  }

  // Disconnect the MutationObserver
  if (observerForNewTweets3) {
    observerForNewTweets3.disconnect();
    observerForNewTweets3 = null;
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
  if (clickbaitTweet) {
    clickbaitTweet.clear();
  }

  console.log("Fake tweet detection stopped");
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in content script", request.action);
  if (request.action === "startClickbaitDetection") {
    if (observer3 || observerForNewTweets3) {
      stopClickbaitDetection();
      removeAllTweetContainers();
      sendResponse({ status: "Clickbait detection stopped" });
    } else {
      startClickbaitDetection();
      sendResponse({ status: "Clickbait detection executed" });
    }
  }
});
