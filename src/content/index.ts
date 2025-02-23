const getWebsiteName = (): string => {
  const hostname = window.location.hostname;
  const cleanHostname = hostname.replace(/^www\./, "");
  const websiteName = cleanHostname.split(".")[0];
  return websiteName.charAt(0).toUpperCase() + websiteName.slice(1);
};

const extractProductData = () => {
  const productNameElement = document.getElementById("productTitle");
  const productName = productNameElement?.textContent?.trim() || "Product Name Not Found";

  const priceContainer = document.getElementById("corePriceDisplay_desktop_feature_div");
  const wholePriceElement = priceContainer?.querySelector(".a-price-whole")?.textContent?.trim();
  const fractionPriceElement = priceContainer?.querySelector(".a-price-fraction")?.textContent?.trim();
  const productPrice = wholePriceElement
    ? fractionPriceElement
      ? `$${wholePriceElement}${fractionPriceElement}`
      : `$${wholePriceElement}00`
    : "Price Not Found";

  const ratingContainer = document.getElementById("acrPopover");
  const ratingElement = ratingContainer?.querySelector(".a-size-base.a-color-base");
  const productRating = ratingElement?.textContent?.trim() || "Rating Not Found";
  const productWebsite = getWebsiteName();
  chrome.runtime.sendMessage({
    action: "sendProductData",
    name: productName,
    price: productPrice,
    rating: productRating,
    website: productWebsite,
  });
};

const observer = new MutationObserver((mutations, obs) => {
  if (document.getElementById("productTitle")) {
    extractProductData();
    obs.disconnect();
  }
});
observer.observe(document.body, { childList: true, subtree: true });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "requestProductData") {
    extractProductData();
  }
});

setTimeout(() => {
  if (document.getElementById("productTitle")) {
    extractProductData();
  }
}, 3000);