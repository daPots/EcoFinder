import { useEffect, useState, CSSProperties } from "react";
import logo from "../assets/logo.png";
import { Star, ShoppingCart, Tag } from "lucide-react";

const App = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // State to store product data
  const [productName, setProductName] = useState<string>("Loading...");
  const [productPrice, setProductPrice] = useState<string>("Loading...");
  const [productRating, setProductRating] = useState<string>("Loading...");

  // Listen for product data messages from the background script
  useEffect(() => {
    console.log("Popup Loaded, Waiting for Data...");

    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === "updatePopup") {
        console.log("Received Data:", message);

        setProductName(message.name || "Not Found");
        setProductPrice(message.price || "Not Found");
        setProductRating(message.rating || "Not Found");
      }
    });

    return () => {
      chrome.runtime.onMessage.removeListener(() => {});
    };
  }, []);

  return (
    <div style={windowStyle}>
      <div style={titleStyle}>
        <img src={logo} alt="Logo" style={{ width: "100px", height: "100px" }} />
        <h1 style={logoStyle}>EcoFinder</h1>
      </div>
      <h1>Current Product Info</h1>
      <div style={detailStyle}>
        <p><ShoppingCart size={20} color="#2e7d32"/> <strong>Product:</strong> {productName}</p>
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
        onClick={() => chrome.runtime.sendMessage({ action: "openProductPage" })}
      > Search Eco-Friendly Alternatives</button>
    </div>
  );
};

export default App;

const buttonStyle: CSSProperties = {
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
  fontFamily: "Arial",
  background: "#f4fff4",
  width: "300px",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};