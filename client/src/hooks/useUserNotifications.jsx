import { useState, useEffect } from "react";
import axios from "axios";

const useUserNotifications = (limit) => {
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [uncheckedNotificationsCount, setUncheckedNotificationsCount] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const apiUrl = limit ? `/api/requests/getnotifications?limit=${Number(limit)}`: `/api/requests/getnotifications`;

    useEffect(() => {
        // Fetch notifications data on component mount
        const fetchNotifications = async () => {
          try {
            const response = await axios.get(apiUrl);
            const data = response.data
            setNotificationsCount(data.notificationsCount);
            setNotifications(data.notifications)
            setUncheckedNotificationsCount(data.uncheckedNotificationsCount)
          } catch (error) {
            console.error("Error fetching notifications:", error);
            // Handle fetching error (optional)
          }
        };
    
        fetchNotifications();
      }, []);
    return { notifications, notificationsCount, uncheckedNotificationsCount }
};

export default useUserNotifications;