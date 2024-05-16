// // content.js

// // Function to remove an element from the DOM
// function removeElement(element) {
//   if (element && element.parentNode) {
//     element.parentNode.removeChild(element);
//   }
// }

// // Find and remove all image elements from the current page
// function removeImages() {
//   var images = document.querySelectorAll("img");
//   for (var i = 0; i < images.length; i++) {
//     removeElement(images[i]);
//   }
// }

// // Listen for messages from the background script
// chrome.runtime.onMessage.addListener(function(message) {
//   if (message.action === "removeImages") {
//     removeImages();
//   }
// });
