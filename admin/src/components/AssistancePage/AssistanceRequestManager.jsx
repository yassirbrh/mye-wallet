import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AssistanceRequestManager = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState("");
  const [userID, setUserID] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/admin/getassistancerequests");
        if (response.status === 200) {
          setConversations(response.data);
          // Get admin ID from somewhere (local storage, context, etc.)
          const adminID = localStorage.getItem("adminID") || "admin-id";
          setUserID(adminID);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedConversation) {
      alert("Message cannot be empty or no conversation selected.");
      return;
    }
  
    try {
      const response = await axios.post("/api/admin/process-assistance-request", {
        assistanceID: selectedConversation._id,
        content: message,
      });
  
      if (response.status === 201 || response.status === 200) {
        // Get admin details from response or local storage
        const adminName = localStorage.getItem("adminName") || "Admin";
        
        // Create new message object
        const newMessage = {
          senderID: userID,
          content: message,
          sentAt: new Date().toISOString(),
          adminName: adminName
        };
        
        // Update local state with new message
        const updatedConversations = conversations.map(conv => {
          if (conv._id === selectedConversation._id) {
            return {
              ...conv,
              messages: [...conv.messages, newMessage]
            };
          }
          return conv;
        });
  
        setConversations(updatedConversations);
        setSelectedConversation({
          ...selectedConversation,
          messages: [...selectedConversation.messages, newMessage]
        });
        
        // Clear the message input
        setMessage("");
        
        // Show success notification (optional)
        toast.success("Response sent successfully!");
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Show more detailed error if available
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("An error occurred while sending the message.");
      }
    }
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  const isUserLastSender = (conversation) => {
    if (!conversation.messages || conversation.messages.length === 0) return false;
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return lastMessage.senderID === conversation.userID._id;
  };

  const getLastMessage = (conversation) => {
    if (!conversation.messages || conversation.messages.length === 0) return null;
    return conversation.messages[conversation.messages.length - 1];
  };

  if (loading) {
    return <div style={styles.loadingContainer}>Loading conversations...</div>;
  }

  return (
    <div style={styles.container}>
      {selectedConversation ? (
        // Conversation View
        <>
          <div style={styles.header}>
            <button onClick={handleBackToList} style={styles.backButton}>
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  style={{marginRight: "8px"}}
                >
                  <path 
                    fill="#44c1f7" 
                    d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"
                  />
                </svg>
                Back to Requests
            </button>
            <h2 style={styles.conversationTitle}>
              Assistance for {selectedConversation.userID.firstName} {selectedConversation.userID.lastName}
            </h2>
          </div>

          <div style={styles.messagesContainer}>
            {selectedConversation.messages.map((msg, index) => (
              <div 
                key={msg._id || index} 
                style={{
                  ...styles.message,
                  ...(msg.senderID === selectedConversation.userID._id ? styles.userMessage : styles.supportMessage)
                }}
              >
                <p style={styles.messageText}>{msg.content}</p>
                <div style={msg.senderID === selectedConversation.userID._id ? styles.timestamp : styles.supportTimestamp}>
                  {new Date(msg.sentAt).toLocaleTimeString()} 
                  {msg.adminName && msg.senderID !== selectedConversation.userID._id && ` (responded by ${msg.adminName})`}
                </div>
              </div>
            ))}
          </div>

          <div style={styles.inputContainer}>
            <input
              type="text"
              style={styles.input}
              value={message}
              placeholder="Type your response here..."
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button style={styles.sendButton} onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </>
      ) : (
        // Conversations List View
        <>
          <h2 style={styles.listHeader}>Assistance Requests</h2>
          <div style={styles.conversationsList}>
            {conversations.length === 0 ? (
              <div style={styles.noConversations}>No assistance requests available</div>
            ) : (
              conversations.map((conversation) => {
                const lastMessage = getLastMessage(conversation);
                const isUnread = isUserLastSender(conversation);
                
                return (
                  <div 
                    key={conversation._id} 
                    style={{
                      ...styles.conversationItem,
                      ...(isUnread ? styles.unreadConversation : {})
                    }}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div style={styles.conversationHeader}>
                      <span style={styles.userName}>
                        {conversation.userID.firstName} {conversation.userID.lastName}
                      </span>
                      <span style={styles.conversationTimestamp}>
                        {lastMessage ? new Date(lastMessage.sentAt).toLocaleDateString() : "No messages"}
                      </span>
                    </div>
                    
                    <div style={styles.lastMessageContainer}>
                      {lastMessage ? (
                        <>
                          <span style={styles.senderIndicator}>
                            {lastMessage.senderID === conversation.userID._id ? "User:" : "Admin:"}
                          </span>
                          <span style={styles.lastMessageContent}>
                            {lastMessage.content.length > 50 
                              ? `${lastMessage.content.substring(0, 50)}...` 
                              : lastMessage.content}
                          </span>
                        </>
                      ) : (
                        <span style={styles.noMessages}>No messages in this conversation</span>
                      )}
                    </div>
                    
                    {isUnread && <div style={styles.unreadIndicator} />}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    width: "90%",
    maxWidth: "800px",
    //height: "90%",
    maxHeight: "600px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "auto",
    overflowY: "scroll", // or "auto"
    scrollbarWidth: "none", // For Firefox
    msOverflowStyle: "none", // For IE & Edge
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    position: "relative"
  },
  backButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    color: "#44c1f7",
    fontWeight: "bold",
    padding: "10px 15px",
    marginRight: "10px",
    display: "flex",
    alignItems: "center",
    borderRadius: "6px",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#f0f7ff"
    }
  },
  conversationTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    margin: 0
  },
  messagesContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    //overflowY: "auto",
    padding: "10px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    maxHeight: "calc(100% - 120px)" // Add this line to constrain height
  },
  message: {
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  },
  userMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f1f1",
    padding: "10px",
    borderRadius: "8px",
    maxWidth: "70%"
  },
  supportMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#44c1f7",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
    maxWidth: "70%"
  },
  messageText: {
    margin: 0
  },
  timestamp: {
    fontSize: "12px",
    color: "#888"
  },
  supportTimestamp: {
    fontSize: "12px",
    color: "#e0e0e0"
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "20px"
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px"
  },
  sendButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#44c1f7",
    color: "white",
    cursor: "pointer"
  },
  listHeader: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center"
  },
  conversationsList: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  conversationItem: {
    padding: "15px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    position: "relative",
    "&:hover": {
      backgroundColor: "#f5f5f5"
    }
  },
  unreadConversation: {
    backgroundColor: "#f0f7ff",
    borderLeft: "4px solid #44c1f7",
    fontWeight: "bold"
  },
  conversationHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px"
  },
  userName: {
    fontWeight: "bold",
    fontSize: "16px"
  },
  conversationTimestamp: {
    color: "#888",
    fontSize: "14px"
  },
  lastMessageContainer: {
    display: "flex",
    color: "#666",
    fontSize: "14px",
    gap: "5px",
    alignItems: "center"
  },
  senderIndicator: {
    fontWeight: "bold",
    minWidth: "40px"
  },
  lastMessageContent: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  noMessages: {
    fontStyle: "italic",
    color: "#aaa"
  },
  unreadIndicator: {
    position: "absolute",
    top: "50%",
    right: "15px",
    transform: "translateY(-50%)",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#44c1f7"
  },
  noConversations: {
    textAlign: "center",
    padding: "20px",
    color: "#888",
    fontStyle: "italic"
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    fontSize: "18px",
    color: "#666"
  }
};

export default AssistanceRequestManager;