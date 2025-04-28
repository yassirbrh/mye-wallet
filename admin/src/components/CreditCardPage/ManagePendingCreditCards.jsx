import React, { useState } from "react";
import useGetCreditCards from "../../hooks/useGetCreditCards";
import axios from "axios";
import visa from "../../assets/visa-credit-card.png";
import mastercard from "../../assets/mastercard-credit-card.png";
import amex from "../../assets/amex-credit-card.png";
import discover from "../../assets/discover-credit-card.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManagePendingCreditCards = () => {
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
  
  const processCreditCardRequest = async (cardId, action) => {
    try {
      await axios.post("/api/admin/processcreditcardrequest", { cardId, action });
      if (action === 'accept') toast.success(`Card request accepted successfully`);
      else if (action === 'deny') toast.success('Card request denied successfully');
      window.location.reload();
    } catch (error) {
      console.error(`Error ${action}ing card request:`, error);
      toast.error(error.message);
    }
  };

  const { creditCards, loading, error } = useGetCreditCards();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={sectionStyle}>
      <h3 style={titleStyle}>Manage Pending Credit Cards Requests</h3>
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
                {card.state === "pending" && (
                  <span style={{ color: "#f39c12", fontWeight: "bold", marginLeft: "10px" }}>
                    (Pending)
                  </span>
                )}
              </div>
              <div style={expiryDateStyle}>Expires: {card.expDate}</div>
            </div>
            <div style={actionButtonsContainer}>
              <button
                style={showButtonStyle}
                onClick={() => handleShowCard(card._id)}
              >
                Show Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dropdown with Credit Card Details */}
      {selectedCard && (
        <div style={dropdownContainerStyle}>
          <div style={dropdownContentStyle}>
            {/* User Details Section */}
            <div style={userDetailsStyle}>
              <h4 style={userDetailsTitleStyle}>User Details</h4>
              <div style={userDetailsContentStyle}>
                <div style={userDetailItemStyle}>
                  <span style={userDetailLabelStyle}>Name:</span>
                  <span style={userDetailValueStyle}>
                    {creditCards.find((card) => card._id === selectedCard)?.userID?.firstName} {" "}
                    {creditCards.find((card) => card._id === selectedCard)?.userID?.lastName}
                  </span>
                </div>
                <div style={userDetailItemStyle}>
                  <span style={userDetailLabelStyle}>Username:</span>
                  <span style={userDetailValueStyle}>
                    {creditCards.find((card) => card._id === selectedCard)?.userID?.userName}
                  </span>
                </div>
                <div style={userDetailItemStyle}>
                  <span style={userDetailLabelStyle}>User ID:</span>
                  <span style={userDetailValueStyle}>
                    {creditCards.find((card) => card._id === selectedCard)?.userID?._id}
                  </span>
                </div>
                <div style={userDetailItemStyle}>
                  <span style={userDetailLabelStyle}>Card Status:</span>
                  <span style={{
                    ...userDetailValueStyle,
                    color: creditCards.find((card) => card._id === selectedCard)?.state === "pending" 
                      ? "#f39c12" 
                      : creditCards.find((card) => card._id === selectedCard)?.state === "blocked"
                        ? "#e74c3c" 
                        : "#2ecc71"
                  }}>
                    {creditCards.find((card) => card._id === selectedCard)?.state.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            
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
              <div style={cvvContainerStyle}>
                <label style={labelStyle}>CVV</label>
                <p style={infoStyle}>
                  {creditCards.find((card) => card._id === selectedCard)?.CVV}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            {creditCards.find((card) => card._id === selectedCard)?.state === "pending" && (
              <div style={actionButtonsRowStyle}>
                <button
                  style={largeAcceptButtonStyle}
                  onClick={() => processCreditCardRequest(selectedCard, "accept")}
                >
                  Accept Request
                </button>
                <button
                  style={largeDenyButtonStyle}
                  onClick={() => processCreditCardRequest(selectedCard, "deny")}
                >
                  Deny Request
                </button>
              </div>
            )}
            
            {creditCards.find((card) => card._id === selectedCard)?.state !== "pending" && (
              <button
                style={{
                ...blockButtonStyle,
                backgroundColor: creditCards.find((card) => card._id === selectedCard)?.state === "active" ? "#e74c3c" : "#2ecc71", // Red for active, green for blocked
                }}
                onClick={() => toggleCardState(selectedCard, creditCards.find((card) => card._id === selectedCard)?.state)}
              >
                {creditCards.find((card) => card._id === selectedCard)?.state === "active" ? "Block" : "Unblock"}
              </button>
            )}

            <button style={hideButtonStyle} onClick={handleHideCard}>
              Hide
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
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
  margin: "0 auto",
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

const actionButtonsContainer = {
  display: "flex",
  gap: "10px",
};

const showButtonStyle = {
  padding: "8px 12px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "#3498db",
  color: "white",
  cursor: "pointer",
};

const acceptButtonStyle = {
  padding: "8px 12px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "#2ecc71",
  color: "white",
  cursor: "pointer",
};

const denyButtonStyle = {
  padding: "8px 12px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "#e74c3c",
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
  width: "450px",
  textAlign: "center",
};

// User details styles
const userDetailsStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  borderRadius: "10px",
  padding: "15px",
  marginBottom: "20px",
  textAlign: "left",
};

const userDetailsTitleStyle = {
  color: "#fff",
  fontSize: "18px",
  marginTop: "0",
  marginBottom: "10px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  paddingBottom: "5px",
};

const userDetailsContentStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "10px",
};

const userDetailItemStyle = {
  marginBottom: "5px",
};

const userDetailLabelStyle = {
  color: "#aaa",
  fontSize: "12px",
  marginRight: "5px",
};

const userDetailValueStyle = {
  color: "#fff",
  fontSize: "14px",
  fontWeight: "bold",
};

// Credit card styles
const creditCardStyle = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(15px)",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
  color: "white",
  textAlign: "left",
  marginBottom: "20px",
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
  marginBottom: "10px",
};

const cvvContainerStyle = {
  marginTop: "5px",
};

const labelStyle = {
  fontSize: "12px",
  color: "#aaa",
};

const infoStyle = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#fff",
  margin: "3px 0",
};

// Action buttons styles
const actionButtonsRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  marginBottom: "10px",
};

const largeAcceptButtonStyle = {
  flex: "1",
  padding: "12px 10px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "#2ecc71",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const largeDenyButtonStyle = {
  flex: "1",
  padding: "12px 10px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "#e74c3c",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const blockButtonStyle = {
  width: "100%",
  marginBottom: "10px",
  padding: "12px 20px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "#f39c12",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const hideButtonStyle = {
  width: "100%",
  padding: "12px 20px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "#3498db",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

export default ManagePendingCreditCards;