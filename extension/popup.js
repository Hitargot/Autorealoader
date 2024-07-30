document.addEventListener('DOMContentLoaded', () => {
  const intervalInput = document.getElementById('interval-input');
  const toggleButton = document.getElementById('toggle-button');
  const status = document.getElementById('status');
  const optionsLink = document.getElementById('options-link');

  let currentTabId = null;
  let isActive = false;

  function updateStatus() {
    if (isActive) {
      status.textContent = 'Auto-Reload is Active';
      status.className = 'status-active';
      toggleButton.textContent = 'Stop Auto-Reload';
    } else {
      status.textContent = 'Auto-Reload is Inactive';
      status.className = 'status-inactive';
      toggleButton.textContent = 'Start Auto-Reload';
    }
  }

  // Get the current active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    currentTabId = tabs[0].id;
    chrome.storage.local.get(['tabsState'], (result) => {
      const tabsState = result.tabsState || {};
      const tabState = tabsState[currentTabId];
      if (tabState) {
        intervalInput.value = tabState.interval / 1000;
        isActive = true;
        updateStatus();
      }
    });
  });

  // Handle button clicks
  toggleButton.addEventListener('click', () => {
    const interval = parseInt(intervalInput.value) * 1000;
    if (isActive) {
      chrome.runtime.sendMessage({ action: 'stop', tabId: currentTabId });
    } else {
      chrome.runtime.sendMessage({ action: 'start', tabId: currentTabId, interval });
    }
    isActive = !isActive;
    updateStatus();
  });

  // Options page link
  optionsLink.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
});
