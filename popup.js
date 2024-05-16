// popup.js

document.addEventListener('DOMContentLoaded', function() {
  // Function to send a message to the content script to remove images
  function removeImages() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "removeImages" });
    });
  }

  // Bind the button click event to the removeImages function
  document.getElementById("removeBtn").addEventListener("click", removeImages);
});
