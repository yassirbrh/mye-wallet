import React from "react";
import Sidebar from "../components/Bars/SideBar";
import MainContent from "../components/MainContent";
import useAdminData from "../hooks/useAdminData";

const ProfilePage = () => {
    const adminData = useAdminData();
    return (
        <>
            <div className="op-container">
                <Sidebar adminData={adminData}/>
                <MainContent adminData={adminData} currentPage={'ProfilePage'}/>
            </div>
        </>
    )
};

export default ProfilePage;