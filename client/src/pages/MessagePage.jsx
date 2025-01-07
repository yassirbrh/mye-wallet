import React from "react";
import Sidebar from "../components/Bars/Sidebar";
import MainContent from "../components/MainContent";
import useUserData from "../hooks/useUserData";

const MessagePage = () => {
    const userData = useUserData();
    return (
        <>
            <Sidebar activeItem="Messages" />
            <MainContent userData={userData} currentPage={'MessagePage'}/>
        </>
    )
};

export default MessagePage;