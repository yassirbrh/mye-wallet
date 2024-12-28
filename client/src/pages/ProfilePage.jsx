import React from "react";
import Sidebar from "../components/Bars/Sidebar";
import MainContent from "../components/MainContent";
import useUserData from "../hooks/useUserData";

const ProfilePage = () => {
    const userData = useUserData();
    return (
        <>
            <Sidebar />
            <MainContent userData={userData} currentPage={'ProfilePage'}/>
        </>
    )
};

export default ProfilePage;