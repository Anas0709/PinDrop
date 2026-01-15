// Background service worker for AI Study Assistant Overlay
chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Study Assistant Overlay installed');
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-assistant') {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'togglePins'});
    });
  }
});
