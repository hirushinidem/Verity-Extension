// Example: Get both counts when the popup is opened
document.addEventListener("DOMContentLoaded", async () => {
  const fakeImageCount = await getCount("fake_image_count");
  const fakeImageDetectCount = await getCount("fake_image_detect_count");
  const botCount = await getCount("bot_count");
  const botDetectCount = await getCount("bot_detect_count");
  const clickbaitCount = await getCount("clickbait_count");
  const clickbaitDetectCount = await getCount("clickbait_detect_count");
  const politicalCount = await getCount("political_count");
  const politicalDetectCount = await getCount("political_detect_count");

  //   document.getElementById("fake_image_count").innerHTML = `${fakeImageCount}`;
  document.getElementById("fake_image_count").textContent = fakeImageCount;
  document.getElementById("fake_image_detect_count").textContent =
    fakeImageDetectCount;
  document.getElementById("bot_count").textContent = botCount;
  document.getElementById("bot_detect_count").textContent = botDetectCount;
  document.getElementById("clickbait_count").textContent = clickbaitCount;
  document.getElementById("clickbait_detect_count").textContent =
    clickbaitDetectCount;
  document.getElementById("political_count").textContent = politicalCount;
  document.getElementById("political_detect_count").textContent =
    politicalDetectCount;
});
