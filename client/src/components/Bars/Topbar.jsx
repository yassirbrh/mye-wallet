import React, { useState, useEffect } from "react";
import ProfileDropdown from "../Dropdowns/ProfileDropdown";
import NotificationDropdown from "../Dropdowns/NotificationDropdown";
import useUserNotifications from "../../hooks/useUserNotifications"; 

const Topbar = ({userData}) => {
    const { notifications, notificationsCount, uncheckedNotificationsCount } = useUserNotifications(9);
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    const handleClickOutside = (event) => {
        if (!event.target.closest(".notifications")) {
            setDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className="top-bar">
            <div className="welcome">
                Welcome Back,
                <span style={{
                    color: '#007bff',
                    fontWeight: 'bold',
                    textTransform: 'capitalize',
                    marginLeft: '5px'
                }}>
                    {userData.userName}
                </span>
            </div>
            <div className="profile">
                <div className="notifications">
                    {notificationsCount > 0 && (
                        <span className="notification-count">
                            {notificationsCount > 99 ? "+99" : notificationsCount}
                        </span>
                    )}
                    <span
                        className="bell-icon"
                        onClick={toggleDropdown}
                        style={{ cursor: "pointer" }}
                    >
                        🔔
                    </span>
                    {isDropdownVisible && (
                        <NotificationDropdown notifications={notifications} uncheckedNotificationsCount={uncheckedNotificationsCount}/>
                    )}
                </div>
                <ProfileDropdown userData={userData} />
                <div className="name">{`${userData.firstName} ${userData.lastName}`}</div>
            </div>
        </div>
    );
};

export default Topbar;