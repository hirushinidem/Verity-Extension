// Method to get a specific count by name from storage
async function getCount(countName) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([countName], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        // If the count is not set, default to 0
        const count = result[countName] || 0;
        resolve(count);
      }
    });
  });
}

// Method to update a specific count by name in storage
async function updateCount(countName, newCount) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [countName]: newCount }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        console.log(`${countName} updated to: ${newCount}`);
        resolve(newCount);
      }
    });
  });
}

// Method to increment a specific count by name
async function incrementCount(countName) {
  try {
    const currentCount = await getCount(countName);
    const updatedCount = currentCount + 1;
    await updateCount(countName, updatedCount);
    return updatedCount;
  } catch (error) {
    console.error(`Error updating ${countName}:`, error);
  }
}
