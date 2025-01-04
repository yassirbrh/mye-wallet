import React from "react";
import Sidebar from "../components/Bars/Sidebar";
import MainContent from "../components/MainContent";
import useUserData from "../hooks/useUserData";

const CreditCardPage = () => {
    const userData = useUserData();
    return (
        <>
            <Sidebar activeItem="Credit Cards" />
            <MainContent userData={userData} currentPage={'CreditCardPage'}/>
        </>
    )
};

export default CreditCardPage;