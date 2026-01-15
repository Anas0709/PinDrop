// Popup script for AI Study Assistant Overlay
document.addEventListener('DOMContentLoaded', function() {
  const statusElement = document.getElementById('status');
  const activateBtn = document.getElementById('activateBtn');
  
  // Check if extension is active on current tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: 'checkStatus'}, function(response) {
      if (chrome.runtime.lastError) {
        statusElement.textContent = 'Extension Ready';
        statusElement.className = 'status inactive';
        activateBtn.textContent = 'Activate Assistant';
      } else if (response && response.active) {
        statusElement.textContent = 'Assistant Active';
        statusElement.className = 'status active';
        activateBtn.textContent = 'Deactivate Assistant';
      } else {
        statusElement.textContent = 'Extension Ready';
        statusElement.className = 'status inactive';
        activateBtn.textContent = 'Activate Assistant';
      }
    });
  });
  
  // Handle activate button click
  activateBtn.addEventListener('click', function() {
    console.log('🔘 Activate button clicked');
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      console.log('📋 Current tab:', tabs[0].id);
      chrome.tabs.sendMessage(tabs[0].id, {action: 'togglePins'}, function(response) {
        console.log('📨 Response from content script:', response);
        if (chrome.runtime.lastError) {
          console.error('❌ Error:', chrome.runtime.lastError);
        }
        if (response && response.active) {
          statusElement.textContent = 'Assistant Active';
          statusElement.className = 'status active';
          activateBtn.textContent = 'Deactivate Assistant';
        } else {
          statusElement.textContent = 'Extension Ready';
          statusElement.className = 'status inactive';
          activateBtn.textContent = 'Activate Assistant';
        }
      });
    });
  });
});
