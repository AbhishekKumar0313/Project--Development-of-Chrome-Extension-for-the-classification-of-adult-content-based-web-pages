// content.js

// Send a message to the background script to extract images and get predictions
chrome.runtime.sendMessage({action: 'extractImages'}, function(response) {
  console.log(response.predictions);
});
