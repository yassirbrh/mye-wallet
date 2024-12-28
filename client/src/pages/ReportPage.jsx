import React from "react";
import Sidebar from "../components/Bars/Sidebar";
import MainContent from "../components/MainContent";
import useUserData from "../hooks/useUserData";

const ReportPage = () => {
    const userData = useUserData();
    return (
        <>
            <Sidebar activeItem="Reports" />
            <MainContent userData={userData} currentPage={'ReportPage'}/>
        </>
    )
};

export default ReportPage;