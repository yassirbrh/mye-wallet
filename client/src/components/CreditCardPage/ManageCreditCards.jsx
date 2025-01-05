import React, { useState } from "react";
import useGetCreditCards from "../../hooks/useGetCreditCards";
import axios from "axios";
import visa from "../../assets/visa-credit-card.png";
import mastercard from "../../assets/mastercard-credit-card.png";
import amex from "../../assets/amex-credit-card.png";
import discover from "../../assets/discover-credit-card.png";

const ManageCreditCards = () => {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleShowCard = (cardId) => {
    setSelectedCard(cardId); // Show the selected card
  };

  const handleHideCard = () => {
    setSelectedCard(null); // Hide the card
  };

  const cardImages = {
    visa,
    mastercard,
    amex,
    discover,
  };

  
  const toggleCardState = async (cardId, currentState) => {
    try {
      await axios.post("/api/requests/handlecreditcardstate", { cardId });
      alert(`Card ${cardId} ${currentState === "active" ? "blocked" : "unblocked"}`);
      window.location.reload();
    } catch (error) {
      console.error("Error toggling card state:", error);
    }
  };

  const { creditCards, loading, error } = useGetCreditCards();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={sectionStyle}>
      <h3 style={titleStyle}>Manage Your Credit Cards</h3>
      <div style={cardListStyle}>
        {creditCards.map((card) => (
          <div key={card._id} style={cardItemStyle}>
            <div>
              <div style={cardNumberStyle}>
                **** **** **** {card.cardNumber.toString().slice(-4)}{" "}
                {card.state === "blocked" && (
                  <span style={{ color: "#e74c3c", fontWeight: "bold", marginLeft: "10px" }}>
                    (Blocked)
                  </span>
                )}
              </div>

              <div style={expiryDateStyle}>Expires: {card.expDate}</div>
            </div>
            <button
              style={showButtonStyle}
              onClick={() => handleShowCard(card._id)}
            >
              Show
            </button>
          </div>
        ))}
      </div>

      {/* Dropdown with Credit Card Details */}
      {selectedCard && (
        <div style={dropdownContainerStyle}>
          <div style={dropdownContentStyle}>
            {/* Credit Card Design */}
            <div style={creditCardStyle}>
              <img
                src={cardImages[creditCards.find((card) => card._id === selectedCard)?.cardType]}
                alt="Card Logo"
                style={cardLogoStyle}
              />
              <div style={cardNumberStyleBig}>
                {creditCards
                  .find((card) => card._id === selectedCard)
                  ?.cardNumber.toString()
                  .match(/.{1,4}/g)
                  .join(" ")}
              </div>
              <div style={cardDetailsStyle}>
                <div>
                  <label style={labelStyle}>Card Holder</label>
                  <p style={infoStyle}>
                    {creditCards.find((card) => card._id === selectedCard)?.holderName}
                  </p>
                </div>
                <div>
                  <label style={labelStyle}>Exp. Date</label>
                  <p style={infoStyle}>
                    {creditCards.find((card) => card._id === selectedCard)?.expDate}
                  </p>
                </div>
              </div>
            </div>
            {/* Buttons */}
            <button
              style={{
              ...blockButtonStyle,
              backgroundColor: creditCards.find((card) => card._id === selectedCard)?.state === "active" ? "#e74c3c" : "#2ecc71", // Red for active, green for blocked
              }}
              onClick={() => toggleCardState(creditCards.find((card) => card._id === selectedCard)?._id, creditCards.find((card) => card._id === selectedCard)?.state)}
            >
              {creditCards.find((card) => card._id === selectedCard)?.state === "active" ? "Block" : "Unblock"}
            </button>

            <button style={hideButtonStyle} onClick={handleHideCard}>
              Hide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Inline styles for layout
const sectionStyle = {
  width: "80%",
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  position: "relative",
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "20px",
  fontSize: "20px",
  fontWeight: "bold",
};

const cardListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const cardItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  backgroundColor: "#fff",
};

const cardNumberStyle = {
  fontSize: "18px",
  fontWeight: "bold",
};

const expiryDateStyle = {
  fontSize: "14px",
  color: "#888",
};

const showButtonStyle = {
  padding: "8px 12px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "#2ecc71",
  color: "white",
  cursor: "pointer",
};

const dropdownContainerStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 999,
};

const dropdownContentStyle = {
  position: "relative",
  padding: "20px",
  background: "linear-gradient(-70deg, #202020, #000000)",
  borderRadius: "20px",
  width: "400px",
  textAlign: "center",
};

const creditCardStyle = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(15px)",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
  color: "white",
  textAlign: "left",
};

const cardLogoStyle = {
  width: "60px",
  marginBottom: "10px",
};

const cardNumberStyleBig = {
  fontSize: "24px",
  fontWeight: "bold",
  margin: "10px 0",
};

const cardDetailsStyle = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "14px",
};

const labelStyle = {
  fontSize: "12px",
  color: "#aaa",
};

const infoStyle = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#fff",
};

const blockButtonStyle = {
  marginTop: "20px",
  marginBottom: "10px",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "#f39c12",
  color: "white",
  cursor: "pointer",
};

const hideButtonStyle = {
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "blue",
  color: "white",
  cursor: "pointer",
};

export default ManageCreditCards;
