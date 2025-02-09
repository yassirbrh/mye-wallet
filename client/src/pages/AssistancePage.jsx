import React from "react";
import Sidebar from "../components/Bars/Sidebar";
import MainContent from "../components/MainContent";
import useUserData from "../hooks/useUserData";

const AssistancePage = () => {
    const userData = useUserData();
    return (
        <>
            <Sidebar activeItem="Assistance" />
            <MainContent userData={userData} currentPage={'AssistancePage'}/>
        </>
    )
};

export default AssistancePage;