import React, { useState, useEffect } from "react";
import axios from "axios";
import useSendMessage from "../../hooks/useSendMessage";

const MessageDashboard = () => {
  const [conversations, setConversations] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [unSeenMessages, setUnSeenMessages] = useState({});
  const { sendMessage, isLoading, error } = useSendMessage();

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get("/api/requests/getconversations");
        const conversationList = Object.entries(res.data).map(([id, details]) => ({
          id,
          ...details,
        }));
    
        // Fetch profile pictures and unseen counts
        const enhancedConversations = await Promise.all(
          conversationList.map(async (beneficiary) => {
            try {
              const photoResponse = await axios.post(
                "/api/users/getphotobyusername",
                { userName: beneficiary.counterpartUserName },
                { responseType: "arraybuffer" }
              );
    
              const base64Flag = `data:${photoResponse.headers["content-type"]};base64,`;
              const base64Image =
                base64Flag +
                btoa(String.fromCharCode(...new Uint8Array(photoResponse.data)));
    
              return {
                ...beneficiary,
                avatar: base64Image,
              };
            } catch (error) {
              console.error(
                `Failed to fetch photo for ${beneficiary.counterpartUserName}`,
                error
              );
              return { ...beneficiary, avatar: null };
            }
          })
        );
    
        // Calculate unseen messages for all users
        const unseenCounts = conversationList.reduce((acc, conversation) => {
          const unseenCount = conversation.messages.reduce(
            (count, message) => (!message.isSeen && !message.isMyMessage ? count + 1 : count),
            0
          );
          if (unseenCount > 0) {
            acc[conversation.counterpartUserName] = unseenCount;
          }
          return acc;
        }, {});
    
        setUnSeenMessages(unseenCounts); // Update state with calculated unseen messages
        setConversations(enhancedConversations);
        paginateData(enhancedConversations, pageSize);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };    

    fetchConversations();
  }, [pageSize]);

  const checkMessages = async (userName) => {
    try {
      await axios.post(`/api/requests/checkmessages`, {
        userName,
      });
  
      setUnSeenMessages({});
    } catch (error) {
      console.error(`Error checking messages for user: ${userName}`, error);
      return 0; // Return 0 on failure
    }
  };
  

  const handleSend = async () => {
    if (!messageContent.trim()) {
      alert('Message cannot be empty.');
      return;
    }

    try {
      await sendMessage(selectedConversation.counterpartUserName, messageContent);
      setMessageContent(''); // Clear the input after sending
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const paginateData = (data, size) => {
    if (size === Infinity) {
      setPaginatedData([data]);
    } else {
      const paginated = [];
      for (let i = 0; i < data.length; i += size) {
        paginated.push(data.slice(i, i + size));
      }
      setPaginatedData(paginated);
    }
  };

  const totalPages = paginatedData.length;

  const handlePageSizeChange = (value) => {
    if (value === "all") {
      setPageSize(Infinity);
    } else {
      setPageSize(Number(value));
    }
  };

  const handlePageChange = (page) => {
    if (page === "<") setCurrentPage((prev) => Math.max(prev - 1, 1));
    else if (page === ">") setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    else setCurrentPage(page);
  };

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
    setIsDropdownOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedConversation(null);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.querySelector('.messages').scrollTop = document.querySelector('.messages').scrollHeight;
    }
  }, [isDropdownOpen, selectedConversation]);
  return (
    <div style={styles.dashboard}>
      <div style={styles.container}>
        <h3 style={styles.title}>Conversations</h3>
        <div style={styles.conversationsList}>
          {paginatedData[currentPage - 1]?.map((conversation, index) => (
            <div
              key={index}
              style={{
                ...styles.conversationItem,
                ...(!conversation.isSeen ? styles.unseenMessage : {}),
              }}
              onClick={() => handleConversationClick(conversation)}
            >
              <div style={styles.avatar}>
                {conversation.avatar ? (
                  <img
                    src={conversation.avatar}
                    alt="Avatar"
                    style={styles.avatarImg}
                  />
                ) : (
                  <div style={styles.defaultAvatar}>?</div>
                )}
              </div>
              <div style={styles.conversationContent} onClick={() => checkMessages(conversation.counterpartUserName)}>
                <div style={styles.userName}>{conversation.counterpartUserName}</div>
                <div style={styles.lastMessage}>
  			        		{conversation.messages[conversation.messages.length - 1]?.isMyMessage ? "You: " : ""}
  			        		{conversation.messages[conversation.messages.length - 1]?.content || "No messages yet"}
				        </div>
              </div>
              {unSeenMessages[conversation.counterpartUserName] && (
                <div style={styles.badge}>{unSeenMessages[conversation.counterpartUserName]}</div>
              )}
            </div>
          ))}
        </div>

        {isDropdownOpen && selectedConversation && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <h4>Chat with {selectedConversation.counterpartUserName}</h4>
              <div className="messages" style={styles.messages}>
                {selectedConversation.messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.message,
                      ...(msg.senderID === selectedConversation.id
                        ? styles.receivedMessage
                        : styles.sentMessage),
                    }}
                  >
                    <p>{msg.content}</p>
                    <small>{new Date(msg.doneAt).toLocaleString()}</small>
                  </div>
                ))}
              </div>
              <div style={styles.inputContainer}>
                <input
                  type="text"
                  placeholder="Type a message"
                  style={styles.input}
				          value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                />
                <button style={styles.sendButton} onClick={handleSend}>Send</button>
              </div>
              <button onClick={handleCloseDetails} style={styles.closeButton}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



// Inline styles
const styles = {
  dashboard: {
    fontFamily: "'Arial', sans-serif",
    display: "flex",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#f7f7f7",
    height: "100vh",
    boxSizing: "border-box",
  },
  container: {
    width: "400px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  title: {
    margin: "0",
    padding: "16px",
    backgroundColor: "#0078d7",
    color: "white",
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "bold",
  },
  conversationsList: {
    maxHeight: "calc(100vh - 120px)",
    overflowY: "auto",
  },
  conversationItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #eaeaea",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  unseenMessage: {
    backgroundColor: "#f1f9ff",
  },
  avatar: { marginRight: "10px" },
  avatarImg: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
  },
  defaultAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#ccc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#fff",
  },
  conversationContent: {
    flex: 1,
  },
  userName: {
    fontWeight: "bold",
    fontSize: "14px",
  },
  lastMessage: {
    fontSize: "12px",
    color: "#888",
  },
  badge: {
    backgroundColor: "#0078d7",
    color: "white",
    borderRadius: "12px",
    padding: "4px 8px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  modalOverlay: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    width: "400px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  messages: {
    maxHeight: "300px",
    overflowY: "auto",
    marginBottom: "20px",
  },
  message: {
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
    fontSize: "14px",
  },
  receivedMessage: {
    backgroundColor: "#f1f1f1",
  },
  sentMessage: {
    backgroundColor: "#0078d7",
    color: "white",
    alignSelf: "flex-end",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  sendButton: {
    padding: "10px 20px",
    backgroundColor: "#0078d7",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  closeButton: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#ccc",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    display: "block",
    width: "100%",
  },
};

export default MessageDashboard;
