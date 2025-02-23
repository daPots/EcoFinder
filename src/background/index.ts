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
            The user will provide you with the product details, and you will respond with a list of three eco-friendly alternatives, each with a URL.`},
          { role: "user", content: 
            `Find 3 eco-friendly alternatives on ${productWebsite} website for this product: ${productName}, Price: ${productPrice}, Rating: ${productRating}. 
            The alternatives should be available on ${productWebsite}.

            Your response should be in the following format:
            [Name of Alternate Product 1]: [URL of Eco-Friendly Alternative]
            1-sentence description of why alternative is better than original product.
            
            [Name of Alternate Product 2]: [URL of Eco-Friendly Alternative]
            1-sentence description of why alternative is better than original product.
            
            [Name of Alternate Product 3]: [URL of Eco-Friendly Alternative]
            1-sentence description of why alternative is better than original product.` } 
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

    const alternatives = response.data.choices[0]?.message?.content?.split("\n").filter(Boolean) || [];
    chrome.runtime.sendMessage({
      action: "displayAlternatives",
      alternatives,
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

  return true;
});