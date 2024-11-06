import React, { useState, useEffect } from "react";
import axios from "axios";
import FullNotificationDropdown from "./FullNotificationDropdown";

const NotificationDropdown = ({ notifications, uncheckedNotificationsCount }) => {
    const [visibleCount, setVisibleCount] = useState(9);
    const [seenNotifications, setSeenNotifications] = useState([]);
    const [showFullDropdown, setShowFullDropdown] = useState(false); // Toggle for full dropdown
    const [clickedNotification, setClickedNotification] = useState(null); // Store clicked notification

    const dropdownStyle = {
        position: "absolute",
        right: 0,
        top: "100%",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
        borderRadius: "10px",
        width: "300px",
        maxHeight: "400px",
        overflowY: "auto",
        padding: "15px",
        zIndex: 1000,
    };

    const getNotificationItemStyle = (state) => ({
        padding: "10px 12px",
        borderBottom: "1px solid #e0e0e0",
        display: "flex",
        flexDirection: "column",
        fontSize: "14px",
        cursor: "pointer",
        color: state === "unchecked" || state === "seen" ? "#333" : "#555",
        fontWeight: state === "unchecked" || state === "seen" ? "bold" : "normal",
        backgroundColor: state === "unchecked" || state === "seen" ? "#f0f0f0" : "#fff",
    });

    const messageStyle = {
        marginBottom: "5px",
        fontSize: "16px",
        color: "#007bff",
        wordWrap: "break-word",
    };

    const typeStyle = {
        fontSize: "12px",
        color: "#555",
        textTransform: "capitalize",
    };

    const noNotificationsStyle = {
        padding: "15px",
        textAlign: "center",
        color: "#888",
        fontSize: "14px",
    };

    const showMoreStyle = {
        padding: "10px",
        textAlign: "center",
        cursor: "pointer",
        color: "#007bff",
        fontSize: "14px",
        fontWeight: "bold",
    };

    const showMoreNotifications = () => {
        setShowFullDropdown(true); // Show the full dropdown
        setClickedNotification(null); // Reset when "Show more" is clicked
    };

    // Function to handle notification click and pass notifID
    const handleNotificationClick = (notification) => {
        setClickedNotification(notification); // Store clicked notification ID
        setShowFullDropdown(true); // Show full dropdown when any notification is clicked
    };

    useEffect(() => {
        const newlySeenNotifications = notifications
            .slice(0, visibleCount)
            .filter((notification) => notification.state === 'unchecked')
            .map((notification) => notification.notifID)
            .filter((notifID) => !seenNotifications.includes(notifID));

        if (newlySeenNotifications.length > 0) {
            setSeenNotifications((prev) => [...prev, ...newlySeenNotifications]);

            axios.post('/api/requests/seenotifications', { notificationsIDs: newlySeenNotifications })
                .then(response => {
                    console.log("Seen notifications sent successfully:", response.data);
                })
                .catch(error => {
                    console.error("Error sending seen notifications:", error);
                });
        }
    }, [notifications, visibleCount, seenNotifications]);

    return (
        <>
            {/* Main Dropdown */}
            <div style={dropdownStyle}>
                {notifications.length > 0 ? (
                    <>
                        {notifications.slice(0, visibleCount).map((notification, index) => (
                            <div 
                                key={index} 
                                style={getNotificationItemStyle(notification.state)} 
                                onClick={() => handleNotificationClick(notification)}  // Pass notifID on click
                            >
                                <div style={messageStyle}>{notification.notifMessage}</div>
                                <div style={typeStyle}>Type: {notification.type}</div>
                            </div>
                        ))}
                        {uncheckedNotificationsCount > visibleCount && (
                            <div style={showMoreStyle} onClick={showMoreNotifications}>
                                Show more...
                            </div>
                        )}
                    </>
                ) : (
                    <div style={noNotificationsStyle}>No new notifications</div>
                )}
            </div>

            {/* Full Dropdown */}
            {showFullDropdown && (
                <FullNotificationDropdown
                    clickedNotification={clickedNotification} // Pass clicked notification ID
                    closeDropdown={() => setShowFullDropdown(false)}
                />
            )}
        </>
    );
};

export default NotificationDropdown;
