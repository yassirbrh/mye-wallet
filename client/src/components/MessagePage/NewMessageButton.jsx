import React, { useState, useEffect } from "react";
import axios from "axios";
import OverviewDropdown from "../OverviewPage/OverviewDropdown";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useSendMessage from "../../hooks/useSendMessage";

const NewMessageButton = ({ beneficiaries }) => {
  const [isNewMessageDropdownOpen, setNewMessageDropdownOpen] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [conversation, setConversation] = useState([]);
  const { sendMessage, isLoading, error } = useSendMessage();

  const handleSend = async () => {
    if (!messageContent.trim()) {
      alert('Message cannot be empty.');
      return;
    }

    try {
      await sendMessage(selectedBeneficiary, messageContent);
      setMessageContent(''); // Clear the input after sending
      alert('Message sent successfully!');
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };
  const handleGetMessages = async (userName) => {
    try {
      if (userName)
      {
        const response = await axios.post('/api/requests/getconversationbyusername', {userName});
        setConversation(response.data);
      }
    } catch (err) {
      console.error(err)
    }
  };

  useEffect(() => {
    handleGetMessages(selectedBeneficiary);
    console.log(conversation)
  }, [selectedBeneficiary]);

  const buttonStyle = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#27ae60",
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  };

  return (
    <>
      <div
        className="dashboard"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          margin: "20px 0",
        }}
      >
        <button style={buttonStyle} onClick={() => setNewMessageDropdownOpen(true)}>
          <i className="bx bx-plus" style={{ fontSize: "16px" }}></i> New Message
        </button>
      </div>

      <ToastContainer />

      {/* Report Dropdown */}
      <OverviewDropdown
        isOpen={isNewMessageDropdownOpen}
        onClose={() => setNewMessageDropdownOpen(false)}
      >
        {selectedBeneficiary ? (
          // Conversation view
          <div>
            <button
              onClick={() => setSelectedBeneficiary(null)}
              style={{
                padding: "10px",
                backgroundColor: "#ddd",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginBottom: "10px",
              }}
            >
              Go Back
            </button>
            <h3>Conversation with {selectedBeneficiary}</h3>
            <div
              style={{
                height: "200px",
                overflowY: "scroll",
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {conversation.map((message) => (
                <div
                  key={message._id}
                  style={{
                    alignSelf: message.senderUsername ? "flex-start" : "flex-end",
                    backgroundColor: message.senderUsername ? "#f0f0f0" : "#d1f7c4",
                    padding: "10px",
                    borderRadius: "15px",
                    maxWidth: "70%",
                    wordBreak: "break-word",
                  }}
                >
                  <strong>{message.senderUsername || "You"}:</strong> {message.content}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type your message..."
                style={{
                  flex: "1",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <button
                onClick={handleSend}
                style={{
                  padding: "10px",
                  backgroundColor: "#44c1f7",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
          </div>
        ) : (
          // Beneficiaries list
          <div>
            <h3>Select a Beneficiary</h3>
            <ul
              style={{
                listStyle: "none",
                padding: "0",
                margin: "10px 0",
              }}
            >
              {beneficiaries.map((beneficiary, index) => (
                <li
                  key={index}
                  onClick={() => setSelectedBeneficiary(beneficiary)}
                  style={{
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    marginBottom: "10px",
                    cursor: "pointer",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  {beneficiary}
                </li>
              ))}
            </ul>
          </div>
        )}
      </OverviewDropdown>
    </>
  );
};

export default NewMessageButton;
