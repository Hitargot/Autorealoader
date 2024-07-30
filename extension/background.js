let tabsState = {}; // Store state for each tab

// Function to start auto-reloading
function startAutoReload(tabId, interval) {
  if (tabsState[tabId]) {
    clearInterval(tabsState[tabId].intervalId);
  }
  
  const intervalId = setInterval(() => {
    chrome.tabs.reload(tabId);
  }, interval);

  tabsState[tabId] = {
    intervalId,
    interval
  };
  chrome.storage.local.set({ tabsState });
}

// Function to stop auto-reloading
function stopAutoReload(tabId) {
  if (tabsState[tabId]) {
    clearInterval(tabsState[tabId].intervalId);
    delete tabsState[tabId];
    chrome.storage.local.set({ tabsState });
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action, tabId, interval } = message;

  if (action === 'start') {
    chrome.tabs.get(tabId, (tab) => {
      if (chrome.runtime.lastError || !tab) {
        console.error('Tab not found:', chrome.runtime.lastError);
        sendResponse({ success: false, message: 'Tab not found' });
        return;
      }
      startAutoReload(tabId, interval);
      sendResponse({ success: true });
    });
  } else if (action === 'stop') {
    stopAutoReload(tabId);
    sendResponse({ success: true });
  }

  return true; // Indicate you want to send a response asynchronously
});

// Clean up when a tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  stopAutoReload(tabId);
});
