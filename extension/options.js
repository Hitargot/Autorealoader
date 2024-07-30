document.addEventListener('DOMContentLoaded', () => {
    const globalIntervalInput = document.getElementById('global-interval');
    const saveButton = document.getElementById('save-button');
  
    // Load saved settings
    chrome.storage.local.get(['defaultInterval'], (result) => {
      globalIntervalInput.value = result.defaultInterval || 60;
    });
  
    // Save settings
    saveButton.addEventListener('click', () => {
      const defaultInterval = parseInt(globalIntervalInput.value) * 1000;
      chrome.storage.local.set({ defaultInterval }, () => {
        alert('Settings saved!');
      });
    });
  });
  