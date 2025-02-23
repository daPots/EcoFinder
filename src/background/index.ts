chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "sendProductData") {
      console.log("📩 Received Product Data:", message);
  
      // Forward data to popup UI
      chrome.runtime.sendMessage({
        action: "updatePopup",
        name: message.name,
        price: message.price,
        rating: message.rating,
      });
    }
});  