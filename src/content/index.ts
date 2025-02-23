const getWebsiteName = (): string => {
  const hostname = window.location.hostname;
  const cleanHostname = hostname.replace(/^www\./, "");
  const websiteName = cleanHostname.split(".")[0];
  return websiteName.charAt(0).toUpperCase() + websiteName.slice(1);
};

const extractProductData = () => {
  const productWebsite = getWebsiteName();

  let productName = "";
  let productPrice = "";
  let productRating = "";
  
  if (productWebsite === "Amazon") {
    productName = document.getElementById("productTitle")?.textContent?.trim() || "Not Found";

    const priceContainer = document.getElementById("corePriceDisplay_desktop_feature_div");
    const wholePriceElement = priceContainer?.querySelector(".a-price-whole")?.textContent?.trim();
    const fractionPriceElement = priceContainer?.querySelector(".a-price-fraction")?.textContent?.trim();
    productPrice = wholePriceElement
      ? fractionPriceElement
        ? `$${wholePriceElement}${fractionPriceElement}`
        : `$${wholePriceElement}00`
      : "Not Found";

    const ratingContainer = document.getElementById("acrPopover");
    const ratingElement = ratingContainer?.querySelector(".a-size-base.a-color-base");
    productRating = ratingElement?.textContent?.trim() || "Not Found";
  } 
  else if (productWebsite === "Walmart") {
    productName = document.getElementById("main-title")?.textContent?.trim() || "Not Found";
    productPrice = document.querySelector('[data-seo-id="hero-price"]')?.textContent?.trim() || "Not Found";
    const ratingElement = document.querySelector(".f7.ph1");
    productRating = ratingElement?.textContent?.trim().slice(1, -1) || "Not Found";
  } 
  else if (productWebsite === "Ebay") {
    const productNameContainer = document.getElementsByClassName("x-item-title__mainTitle")[0];
    const productNameElement = productNameContainer?.getElementsByClassName("ux-textspans ux-textspans--BOLD")[0];
    productName = productNameElement?.textContent?.trim() || "Not Found";

    const productPriceContainer = document.getElementsByClassName("x-price-primary")[0];
    const productPriceElement = productPriceContainer?.getElementsByClassName("ux-textspans")[0];
    productPrice = productPriceElement?.textContent?.trim().split(" ")[1] || "Not Found";

    const ratingContainer = document.getElementsByClassName("x-sellercard-atf__data-item-wrapper")[0];
    const ratingElement = ratingContainer?.getElementsByClassName("ux-textspans ux-textspans--PSEUDOLINK")[0];
    productRating = ratingElement?.textContent?.trim().split(" ")[0] || "Not Found";
  } 
  else if (productWebsite === "Target") {
    productName = document.getElementById("pdp-product-title-id")?.textContent?.trim() || "Not Found";
    productPrice = document.getElementsByClassName("sc-1b90d18d-1 dTMyqP")[0]?.textContent?.trim() || "Not Found";

    const ratingContainer = document.querySelectorAll(".styles_starSVG__B22sj .starFill[fill='#ffd700']");
    const starCount = Math.min(ratingContainer.length, 5);
    productRating = starCount > 0 ? `~${starCount}.0` : "Rating Not Found";
    
  }

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