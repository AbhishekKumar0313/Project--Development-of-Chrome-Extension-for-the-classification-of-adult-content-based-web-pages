// background.js

// Load the model from the JSON file
fetch('D:\chrome\my_model.json')
  .then(response => response.json())
  .then(model => {
    // Set the threshold for blocking the webpage
    const threshold = 0.5;

    // Listen for messages from the content script
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      // If the message is to extract images, send them to the model for prediction
      if (request.action === 'extractImages') {
        const images = document.getElementsByTagName('img');
        const predictions = [];

        for (let i = 0; i < images.length; i++) {
          // Convert the image to a tensor
          const tensor = tf.browser.fromPixels(images[i])
            .resizeNearestNeighbor([224, 224])
            .toFloat()
            .expandDims();

          // Normalize the tensor
          const mean = tf.tensor([0.485, 0.456, 0.406]);
          const std = tf.tensor([0.229, 0.224, 0.225]);
          const normalized = tensor.div(mean).sub(std);

          // Predict the image label using the model
          const prediction = tf.model(model).predict(normalized).dataSync()[0];

          // Save the prediction for this image
          predictions.push(prediction);

          // If the prediction is above the threshold, block the webpage
          if (prediction <= threshold) {
            chrome.tabs.update(sender.tab.id, {url: 'blocked.html'});
          }
        }

        // Send the predictions back to the content script
        sendResponse({predictions: predictions});
      }
    });
  });
