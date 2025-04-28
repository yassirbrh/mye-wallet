import React, { useState, useEffect } from "react";
import ProfileDropdown from '../Dropdowns/ProfileDropdown'

const Topbar = ({adminData}) => {
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
                    {adminData.userName}
                </span>
            </div>
            <div className="profile">
                <ProfileDropdown adminData={adminData} />
                <div className="name">{`${adminData.firstName} ${adminData.lastName} `}<span style={{ fontWeight: "normal", color: "#007bff" }}>({adminData.adminType})</span></div>
            </div>
        </div>
    );
};

export default Topbar