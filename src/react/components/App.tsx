import { useEffect, useState, CSSProperties } from "react";
import logo from "../../../logo.png";
import { ShoppingCart, Store, Tag, Star } from "lucide-react";
import axios from "axios";

const App = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [loading, setLoading] = useState(false);

  const [productName, setProductName] = useState<string>("Loading...");
  const [productPrice, setProductPrice] = useState<string>("Loading...");
  const [productRating, setProductRating] = useState<string>("Loading...");
  const [productWebsite, setProductWebsite] = useState<string>("Loading...");


  const [alternatives, setAlternatives] = useState<string[][]>([]);

  useEffect(() => {
    const messageListener = (message: { action: string; alternatives?: string[][]; name?: string; price?: string; rating?: string; website?: string }) => {
      if (message.action === "updatePopup") {
        setProductName(message.name || "Not Found");
        setProductPrice(message.price || "Not Found");
        setProductRating(message.rating || "Not Found");
        setProductWebsite(message.website || "Not Found");
      }
  
      if (message.action === "displayAlternatives") {
        setAlternatives(message.alternatives || []);
        chrome.storage.local.set({ savedAlternatives: message.alternatives }, () => {});
        setLoading(false);
      }
    };
  
    chrome.storage.local.get("savedAlternatives", (data) => {
      if (data.savedAlternatives) {
        setAlternatives(data.savedAlternatives);
      }
    });
    
    chrome.runtime.sendMessage({ action: "requestProductData" });
    chrome.runtime.onMessage.addListener(messageListener);  
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);   

  const findAlternatives = () => {
    setLoading(true);
    chrome.runtime.sendMessage(
      {
        action: "findEcoAlternatives",
        productName,
        productPrice,
        productRating,
        productWebsite,
      },
      (response) => {
        if (chrome.runtime.lastError) setLoading(false);
      }
    );
  };
  

  return (
    <div style={windowStyle}>
      <div style={titleStyle}>
        <img src={logo} alt="Logo" style={{ width: "100px", height: "100px" }} />
        <h1 style={logoStyle}>EcoFinder</h1>
      </div>
      <h1>Current Product Info</h1>
      <div style={detailStyle}>
        <p><ShoppingCart size={20} color="#2e7d32"/> <strong>Product:</strong> {productName}</p>
        <p><Store size={20} color="#2e7d32"/> <strong>Website:</strong> {productWebsite}</p>
        <p><Tag size={20} color="#2e7d32" /> <strong>Price:</strong> {productPrice}</p>
        <p><Star size={20} color="#2e7d32" /> <strong>Rating:</strong> {productRating}</p>
      </div>
      <button
        style={{
          ...buttonStyle,
          ...(isHovered ? hoverStyle : {}),
          ...(isClicked ? activeStyle : {}),
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsClicked(true)}
        onMouseUp={() => setIsClicked(false)}
        onClick={findAlternatives}
      > Search Eco-Friendly Alternatives</button>
      {loading && (
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <p style={{ fontStyle: "italic", color: "#2e7d32", fontSize: "18px" }}>Finding alternatives...</p>
          <div className="spinner"></div>
        </div>
      )}
      {alternatives.length > 0 && (
        <div style={alternativesContainerStyle}>
          <h2>Eco-Friendly Alternatives:</h2>
          <ol>
            {alternatives.map((alt, index) => (
              <li key={index} style={alternativeItemStyle}>
                <p><strong>Alternative:</strong> {alt[0]}</p>
                <p><strong>URL:</strong> <a href={alt[1]} target="_blank" rel="noopener noreferrer" style={urlStyle}>{alt[1]}</a></p>
                <p><strong>Why It's Better:</strong> {alt[2]}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default App;

const urlStyle: CSSProperties = {
  color: "#2e7d32",
  textDecoration: "none",
  cursor: "pointer",
  wordBreak: "break-word",
  overflowWrap: "break-word",
  display: "inline-block",
  maxWidth: "100%",
  whiteSpace: "normal"
};

const alternativesContainerStyle: CSSProperties = {
  marginTop: "15px",
  textAlign: "left",
  width: "100%",
  paddingLeft: "10px",
  marginRight: "30px",
}; const alternativeItemStyle: CSSProperties = {
  marginBottom: "15px",
  padding: "10px",
  border: "1px solid #2e7d32",
  borderRadius: "8px",
  backgroundColor: "#f4fff4",
};

const buttonStyle: CSSProperties = {
  fontFamily: "Nunito",
  backgroundColor: "#2e7d32",
  border: "none",
  color: "#fff",
  padding: "10px 20px",
  fontSize: "17px",
  cursor: "pointer",
  borderRadius: "25px",
  marginTop: "20px",
}; const hoverStyle = {
  backgroundColor: "#439948",
}; const activeStyle = {
  backgroundColor: "#439948",
};

const detailStyle: CSSProperties = {
  textAlign: "left",
  width: "100%",
  paddingLeft: "20px",
  fontSize: "18px",
};

const logoStyle: CSSProperties = {
  fontFamily: "Sigmar",
  fontSize: "36px",
  color: "#2e7d32",
  textAlign: "center",
  marginRight: "20px",
};

const titleStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  justifyContent: "center",
}

const windowStyle: CSSProperties = {
  padding: "10px",
  background: "#f4fff4",
  width: "300px",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  fontFamily: "Nunito",
};

const spinnerStyle: CSSProperties = {
  width: "30px",
  height: "30px",
  border: "4px solid #2e7d32",
  borderTop: "4px solid transparent",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
}; const keyframesStyle = `@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`; const styleTag = document.createElement("style");
styleTag.innerHTML = keyframesStyle;
document.head.appendChild(styleTag);