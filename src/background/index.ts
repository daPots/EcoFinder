import axios from "axios";

const openAiApiKey = process.env.OPENAI_API_KEY || ""; 
if (!openAiApiKey) console.error("Missing openai API key");

const fetchEcoAlternatives = async (productName: string, productPrice: string, productRating: string, productWebsite: string) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          { role: "system", content: 
            `You are an AI-assistant that finds eco-friendly alternatives to a products given to you by the user. 
            The product name given to you will be very long and specific, but you should be broad and general, takeing liberties 
            if necessary in determining other options to account for eco-friendliness.   
            The user will provide you with the product details, and you will respond with a list of three eco-friendly alternatives.`
          },
          { role: "user", content: 
            `Find 3 eco-friendly alternatives on ${productWebsite} website for this product: ${productName}, Price: ${productPrice}, Rating: ${productRating}. 
            The alternatives should be available on ${productWebsite}. Do NOT add any extra text or explanations than the given format. Your response should be EXACTLY in the format below. 
            Name:1-sentence description of why alternative is better than original product.            
            Name:1-sentence description of why alternative is better than original product.            
            Name:1-sentence description of why alternative is better than original product.
            
            Do not use section indicators like "name" or "description". Just return the above format`   
          } 
        ],
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const rawResponse = response.data.choices[0]?.message?.content || "";
    const alternatives = response.data.choices[0]?.message?.content?.split("\n").filter(Boolean) || [];
    
    const formattedAlts = alternatives.map((alt: string) => {
      const [rawName, rawDescription] = alt.trim().split(":");    
      if (!rawName || !rawDescription) return null;
      const name = rawName.trim();
      const description = rawDescription.trim();
  
      let url = "";
      if (name) {
        if (productWebsite === "Amazon") url = `https://www.amazon.com/s?k=${encodeURIComponent(name)}`;
        else if (productWebsite === "Walmart") url = `https://www.walmart.com/search?q=${encodeURIComponent(name)}`;
        else if (productWebsite === "Ebay") url = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(name)}`;
        else if (productWebsite === "Target") url = `https://www.target.com/s?searchTerm=${encodeURIComponent(name)}`;
      }
  
      return name && description ? [name, url, description] : null;
    }).filter(Boolean);
      
    chrome.runtime.sendMessage({
      action: "displayAlternatives",
      alternatives: formattedAlts,
    });

  } catch (error) {
    console.error("Error calling OpenAI API:", error);
  }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "findEcoAlternatives") {
    fetchEcoAlternatives(message.productName, message.productPrice, message.productRating, message.productWebsite);
    sendResponse({ status: "Processing request..." });
    return true;
  }

  if (message.action === "sendProductData") {
    chrome.runtime.sendMessage({
      action: "updatePopup",
      name: message.name,
      price: message.price,
      rating: message.rating,
      website: message.website,
    });
  }

  if (message.action === "requestProductData") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "requestProductData" });
      }
    });
  
    chrome.storage.local.get("savedAlternatives", (data) => {
      if (data.savedAlternatives) {
        chrome.runtime.sendMessage({
          action: "displayAlternatives",
          alternatives: data.savedAlternatives,
        });
      }
    });
  }
  
  return true;
});