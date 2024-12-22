import React from "react";
import Sidebar from "../components/Bars/Sidebar";
import MainContent from "../components/MainContent";
import useUserData from "../hooks/useUserData";

const AmountDemandPage = () => {
    const userData = useUserData();
    return (
        <>
            <Sidebar activeItem="Amount Demands" />
            <MainContent userData={userData} currentPage={'AmountDemandPage'}/>
        </>
    )
};

export default AmountDemandPage;