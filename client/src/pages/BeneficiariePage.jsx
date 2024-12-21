import React from "react";
import Sidebar from "../components/Bars/Sidebar";
import MainContent from "../components/MainContent";
import useUserData from "../hooks/useUserData";

const BeneficiariePage = () => {
    const userData = useUserData();
    return (
        <>
            <Sidebar activeItem="Beneficiaries" />
            <MainContent userData={userData} currentPage={'BeneficiariePage'}/>
        </>
    )
};

export default BeneficiariePage;