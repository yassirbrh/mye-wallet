import React, { useState, useEffect } from "react";
import axios from "axios";

const AssistanceBar = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("/api/requests/getassistance");
        if (response.status === 200) {
          setMessages(response.data.messages);
          setUserID(response.data.userID);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      alert("Message cannot be empty.");
      return;
    }

    try {
      const response = await axios.post("/api/requests/askassistance", {
        content: message,
      });

      if (response.status === 201) {
        setMessages([...messages, { senderID: userID, content: message, sentAt: new Date().toISOString() }]);
        setMessage("");
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("An error occurred while sending the message.");
    }
  };

  const styles = {
    container: { backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", padding: "20px", width: "90%", maxWidth: "800px", height: "90%", maxHeight: "600px", margin: "0 auto", display: "flex", flexDirection: "column" },
    header: { fontSize: "24px", fontWeight: "bold", marginBottom: "20px", textAlign: "center" },
    messagesContainer: { flex: 1, display: "flex", flexDirection: "column", gap: "15px", overflowY: "auto", padding: "10px", border: "1px solid #e0e0e0", borderRadius: "8px", backgroundColor: "#f9f9f9" },
    message: { display: "flex", flexDirection: "column", gap: "10px" },
    userMessage: { alignSelf: "flex-end", backgroundColor: "#44c1f7", color: "white", padding: "10px", borderRadius: "8px", maxWidth: "70%" },
    supportMessage: { alignSelf: "flex-start", backgroundColor: "#f1f1f1", padding: "10px", borderRadius: "8px", maxWidth: "70%" },
    messageText: { margin: 0 },
    timestamp: { fontSize: "12px", color: "#e0e0e0" },
    supportTimestamp: { fontSize: "12px", color: "#888" },
    inputContainer: { display: "flex", gap: "10px", marginTop: "20px" },
    input: { flex: 1, padding: "10px", border: "1px solid #ccc", borderRadius: "5px" },
    sendButton: { padding: "10px 20px", border: "none", borderRadius: "5px", backgroundColor: "#44c1f7", color: "white", cursor: "pointer" },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Asking Assistance</h3>
      <div style={styles.messagesContainer}>
        {messages.map((msg) => (
          <div key={msg._id} style={styles.message}>
            <div style={msg.senderID === userID ? styles.userMessage : styles.supportMessage}>
              <p style={styles.messageText}>{msg.content}</p>
              <small style={msg.senderID === userID ? styles.timestamp : styles.supportTimestamp}>
                {new Date(msg.sentAt).toLocaleTimeString()}
                {msg.adminName && msg.senderID !== userID && ` (responded by ${msg.adminName})`}
              </small>
            </div>
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Type your message..."
          style={styles.input}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button style={styles.sendButton} onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
  
};

export default AssistanceBar;
