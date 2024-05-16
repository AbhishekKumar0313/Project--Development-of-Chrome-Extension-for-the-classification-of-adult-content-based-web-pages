// // background.js

// // Function to classify an image using your sensitive image classification model
// // background.js

// // Function to classify an image using your sensitive image classification model
// async function classifyImage(imageData) {
//   // Load the model from the my_model.json file
//   const model = await tf.loadLayersModel("my_model.json");

//   // Preprocess the image data
//   const img = new Image();
//   img.src = imageData;
//   await img.decode();
//   const tensor = tf.browser.fromPixels(img).expandDims();

//   // Normalize the image data
//   const normalizedTensor = tensor.div(255.0);

//   // Make predictions with the model
//   const predictions = model.predict(normalizedTensor);

//   // Convert predictions to boolean result
//   const result = predictions.arraySync()[0] > 0.5;

//   // Clean up resources
//   tensor.dispose();
//   normalizedTensor.dispose();

//   return result;
// }
// background.js

// // Function to classify an image using your sensitive image classification model
// async function classifyImage(imageData) {
//   // Implement your code to classify the image here
//   // You'll need to integrate your sensitive model's code and API
//   // Return the classification result (e.g., true or false)
// }

// Event listener for web requests
// chrome.webRequest.onBeforeRequest.addListener(
//   function(details) {
//     // Check if the request is for an image
//     if (details.type === "image") {
//       // Fetch the image data using XHR
//       var xhr = new XMLHttpRequest();
//       xhr.open("GET", details.url, true);
//       xhr.responseType = "blob";
//       xhr.onload = async function() {
//         if (xhr.status === 200) {
//           var reader = new FileReader();
//           reader.onloadend = async function() {
//             var imageData = reader.result;

//             // Call the image classification function
//             var result = await classifyImage(imageData);

//             // If the model output is true, block the request
//             if (result) {
//               chrome.webRequest.handlerBehaviorChanged();
//               return { cancel: true };
//             }
//           };
//           reader.readAsDataURL(xhr.response);
//         }
//       };
//       xhr.send();
//     }
//   },
//   { urls: ["<all_urls>"], types: ["image"] },
//   ["blocking"]
// );







async function classifyImage(imageData) {
  // Load the model
  const model = await tf.loadGraphModel('D:\New folder\model\model.json');

  // Preprocess the image data
  const image = await preprocessImage(imageData);

  // Reshape the image tensor
  const reshapedImage = tf.reshape(image, [1, image.shape[0], image.shape[1], image.shape[2]]);

  // Normalize the image tensor
  const normalizedImage = tf.div(reshapedImage, 255.0);

  // Make predictions
  const predictions = await model.predict(normalizedImage);

  // Get the predicted class probabilities
  const probabilities = predictions.arraySync()[0];

  // Determine the predicted class based on the highest probability
  const predictedClass = probabilities.indexOf(Math.max(...probabilities));

  // Define a threshold for classifying images as sensitive
  const threshold = 0.5;

  // Return true if the predicted class probability exceeds the threshold (sensitive image)
  return probabilities[predictedClass] > threshold;
}

async function preprocessImage(imageData) {
  const image = await loadImage(imageData);

  // Resize the image to a fixed size
  const resizedImage = tf.image.resizeBilinear(image, [224, 224]);

  // Expand the dimensions to match the expected input shape of the model
  const expandedImage = resizedImage.expandDims();

  // Normalize the image pixel values to the range [0, 1]
  const normalizedImage = expandedImage.div(255.0);

  return normalizedImage;
}

async function loadImage(imageData) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(tf.browser.fromPixels(img));
    img.src = imageData;
  });
}


async function removeImages() {
  const images = document.querySelectorAll("img");

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Draw the image onto the canvas
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Convert the canvas image to base64 data
    const imageData = canvas.toDataURL("image/jpeg");

    // Classify the image using the model
    const result = await classifyImage(imageData);

    // If the model output is true, remove the image
    if (result) {
      img.parentNode.removeChild(img);
    }
  }
}

// Call the removeImages function when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
  removeImages();
});
