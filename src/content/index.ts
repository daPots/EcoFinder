console.log("🚀 EcoScout Content Script Loaded");

// Function to extract product data
const extractProductData = () => {
  console.log("🔍 Extracting product details...");

  // ✅ Get Product Name
  const productNameElement = document.getElementById("productTitle");
  const productName = productNameElement?.textContent?.trim() || "Product Name Not Found";

  // ✅ Get Product Price
  const priceContainer = document.getElementById("corePriceDisplay_desktop_feature_div");
  const wholePriceElement = priceContainer?.querySelector(".a-price-whole")?.textContent?.trim();
  const fractionPriceElement = priceContainer?.querySelector(".a-price-fraction")?.textContent?.trim();
  const productPrice = wholePriceElement
    ? fractionPriceElement
      ? `$${wholePriceElement}.${fractionPriceElement}`
      : `$${wholePriceElement}.00`
    : "Price Not Found";

  // ✅ Get Product Rating
  const ratingContainer = document.getElementById("acrPopover");
  const ratingElement = ratingContainer?.querySelector(".a-size-base.a-color-base");
  const productRating = ratingElement?.textContent?.trim() || "Rating Not Found";

  console.log("✅ Product Name:", productName);
  console.log("✅ Product Price:", productPrice);
  console.log("✅ Product Rating:", productRating);

  // 📩 Send Data to Background Script and Popup
  chrome.runtime.sendMessage({
    action: "sendProductData",
    name: productName,
    price: productPrice,
    rating: productRating,
  });
};

// ✅ Use MutationObserver to wait for content to load
const observer = new MutationObserver((mutations, obs) => {
  if (document.getElementById("productTitle")) {
    extractProductData();
    obs.disconnect(); // Stop observing after extracting data
  }
});
observer.observe(document.body, { childList: true, subtree: true });

// Try extracting immediately if the page is already loaded
setTimeout(() => {
  if (document.getElementById("productTitle")) {
    extractProductData();
  }
}, 3000);