import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import useUserNotifications from "../../hooks/useUserNotifications";

const FullNotificationDropdown = ({ clickedNotification = null, closeDropdown }) => {
    const { notifications } = useUserNotifications();
    const [notificationData, setNotificationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showNotificationList, setShowNotificationList] = useState(!clickedNotification);

    // Ref to the dropdown container
    const dropdownRef = useRef(null);

    // Styles
    const fullDropdownStyle = {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
        borderRadius: "10px",
        width: "600px",
        height: "80vh",
        overflowY: "auto",
        padding: "20px",
        zIndex: 1500,
    };

    const overlayStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(5px)",
        zIndex: 1000,
    };

    const backButtonStyle = {
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        color: "#007bff",
        marginBottom: "10px",
    };

    const HeaderStyle = {
        fontSize: "20px",
        fontWeight: "bold",
        marginBottom: "10px",
        color: "#28a745",
    };

    const messageStyle = {
        marginBottom: "5px",
        fontSize: "16px",
        color: "#007bff",
        wordWrap: "break-word",
    };

    const notificationItemStyle = (notification) => ({
        marginBottom: "5px",
        fontSize: "14px",
        color: notification.state === "unchecked" || notification.state === "seen" ? "#333" : "#555",
        fontWeight: notification.state === "unchecked" || notification.state === "seen" ? "bold" : "normal",
        backgroundColor: notification.state === "unchecked" || notification.state === "seen" ? "#f5f5f5" : "#fff",
        padding: "10px",
    });

    const detailStyle = {
        marginBottom: "5px",
        fontSize: "14px",
        color: "#333",
    };

    const showMoreStyle = {
        padding: "10px",
        textAlign: "center",
        cursor: "pointer",
        color: "#007bff",
        fontSize: "14px",
        fontWeight: "bold",
    };

    // Fetch the notification details based on the clicked notification
    useEffect(() => {
        if (clickedNotification) {
            setLoading(true);
            axios
                .post('/api/requests/checknotification', { notificationID: clickedNotification.notifID })
                .then(response => {
                    setNotificationData(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching notification data:", error);
                    setLoading(false);
                });
        }
    }, [clickedNotification]);

    const renderTransactionDetails = (transaction) => (
        <>
            <div style={HeaderStyle}>Transaction Details</div>
            {/*<div style={detailStyle}><strong>Sender:</strong> {transaction.senderID}</div>*/}
            {/*<div style={detailStyle}><strong>Receiver:</strong> {transaction.receiverID}</div>*/}
            <div style={detailStyle}><strong>Amount:</strong> ${transaction.transactionBalance}</div>
            <div style={detailStyle}><strong>Status:</strong> {transaction.isDone ? "Completed" : "Pending"}</div>
            {transaction.senderMessage && (
                <div style={detailStyle}><strong>Sender's Message:</strong> {transaction.senderMessage}</div>
            )}
            {transaction.doneAt && (
                <div style={detailStyle}><strong>Completed At:</strong> {new Date(transaction.doneAt).toLocaleString()}</div>
            )}
        </>
    );
    const renderMessageDetails = (message) => (
        <>
          <div style={HeaderStyle}>Message Details</div>
          <div style={detailStyle}><strong>Message:</strong> {message.content}</div>
          {message.doneAt && (
            <div style={detailStyle}><strong>Completed At:</strong> {new Date(message.doneAt).toLocaleString()}</div>
          )}
        </>
    );
      

    // Handle going back to the notification list
    const handleGoBack = () => {
        setShowNotificationList(true);
    };

    // Function to open a new window for notification details with improved layout and data
    const openNotificationPopup = (notification) => {
        setLoading(true);
        axios
            .post('/api/requests/checknotification', { notificationID: notification.notifID })
            .then(response => {
                const { transaction, message } = response.data;
    
                if (transaction) {
                    const popupContent = `
                        <html>
                        <head>
                            <title>Transaction Notification</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    margin: 0;
                                    padding: 20px;
                                    background-color: #f4f4f4;
                                }
                                .container {
                                    max-width: 500px;
                                    margin: 0 auto;
                                    background-color: #fff;
                                    padding: 20px;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                                    border-radius: 10px;
                                }
                                h2 {
                                    color: #28a745;
                                    margin-bottom: 20px;
                                }
                                p {
                                    margin: 8px 0;
                                    font-size: 16px;
                                    color: #333;
                                }
                                .transaction-details {
                                    margin-top: 20px;
                                    font-size: 14px;
                                    color: #555;
                                }
                                .bold {
                                    font-weight: bold;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <h2>Transaction</h2>
                                <p>${notification.notifMessage}</p>
                                <div class="transaction-details">
                                    <p><span class="bold">Transaction Details</span></p>
                                    <p><span class="bold">Amount:</span> $${transaction.transactionBalance}</p>
                                    <p><span class="bold">Status:</span> ${transaction.isDone ? "Completed" : "Pending"}</p>
                                    ${transaction.senderMessage ? `<p><span class="bold">Sender's Message:</span> ${transaction.senderMessage}</p>` : ''}
                                    ${transaction.doneAt ? `<p><span class="bold">Completed At:</span> ${new Date(transaction.doneAt).toLocaleString()}</p>` : ''}
                                </div>
                            </div>
                        </body>
                        </html>
                    `;
    
                    // Open a new popup window with the transaction details
                    const popupWindow = window.open('', '_blank', 'width=600,height=600,left=200,top=100');
                    popupWindow.document.write(popupContent);
                    popupWindow.document.close();
                } else if (message) {
                    const popupContent = `
                            <html>
                                <head>
                                <title>Message Notification</title>
                                <style>
                                    body {
                                        font-family: Arial, sans-serif;
                                        margin: 0;
                                        padding: 20px;
                                        background-color: #f9f9f9;
                                    }
                                    .container {
                                        max-width: 400px;
                                        margin: 0 auto;
                                        background-color: #fff;
                                        padding: 15px;
                                        border: 1px solid #ccc;
                                        border-radius: 8px;
                                        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                                    }
                                    h2 {
                                        color: #007bff;
                                        margin-bottom: 15px;
                                        font-size: 20px;
                                    }
                                    p {
                                        margin: 10px 0;
                                        font-size: 14px;
                                        color: #333;
                                    }
                                    .bold {
                                        font-weight: bold;
                                    }
                                </style>
                            </head>
                            <body>
                                <div class="container">
                                    <h2>Message Notification</h2>
                                    <p>${notification.notifMessage}</p>
                                    <p class="bold">Message:</p>
                                    <p>${message.content || "No message content available."}</p>
                                    ${message.doneAt ? `<p><span class="bold">Sent At:</span> ${new Date(message.doneAt).toLocaleString()}</p>` : ""}
                                </div>
                            </body>
                        </html>
                    `;

                    // Open a new popup window with the message details
                    const popupWindow = window.open('', '_blank', 'width=450,height=400,left=300,top=150');
                    popupWindow.document.write(popupContent);
                    popupWindow.document.close();
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching notification data:", error);
                setLoading(false);
            });
    };

    // Return the content based on clickedNotification or go back to notification list
    return (
        <div className="full-notification-dropdown" ref={dropdownRef}>
            <div style={overlayStyle} onClick={closeDropdown}></div>
            <div style={fullDropdownStyle}>
                {showNotificationList ? (
                    <>
                        {notifications.map((notification, index) => (
                            <div key={index} style={notificationItemStyle(notification)} onClick={() => openNotificationPopup(notification)}>
                                <div style={messageStyle}>{notification.notifMessage}</div>
                                <div>{notification.type}</div>
                            </div>
                        ))}
                        <div style={showMoreStyle} onClick={closeDropdown}>
                            Close
                        </div>
                    </>
                ) : clickedNotification ? (
                    loading ? (
                        <div>Loading...</div>
                    ) : (
                        <>
                            <div style={backButtonStyle} onClick={handleGoBack}>
                                <i className="bx bx-arrow-back"></i> Go back to notifications
                            </div>
                            {
                                notificationData?.type === 'Transaction' && (
                                    <>
                                        <div style={HeaderStyle}>Transaction</div>
                                        <div style={messageStyle}>{clickedNotification.notifMessage}</div>
                                        {renderTransactionDetails(notificationData.transaction)}
                                    </>
                                )
                            }
                            {
                                notificationData?.type === 'Message' && (
                                    <>
                                        <div style={HeaderStyle}>Message</div>
                                        <div style={messageStyle}>{clickedNotification.notifMessage}</div>
                                        {renderMessageDetails(notificationData.message)}
                                    </>
                                )
                            }
                            {
                                ['Report'].includes(notificationData?.type) && (
                                    <div>Working on later</div>
                                )
                            }

                        </>
                    )
                ) : null}
            </div>
        </div>
    );
};

export default FullNotificationDropdown;
