// Background service worker for Micro-Pin Answerer
chrome.runtime.onInstalled.addListener(() => {
  console.log('Micro-Pin Answerer installed');
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-pins') {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'togglePins'});
    });
  }
});
