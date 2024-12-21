import axios from "axios";
import React, { useState } from "react";
import Topbar from "./Bars/Topbar";
import OverviewBalance from "./OverviewPage/OverviewBalance";
import OverviewButtons from "./OverviewPage/OverviewButtons";
import OverviewTransactions from "./OverviewPage/OverviewTransactions";
import ProfileInfo from "./ProfilePage/ProfileInfo";
import TransactionButton from "./TransactionPage/TransactionButton";
import TransactionDashboard from "./TransactionPage/TransactionDashboard";
import BeneficiarieDashboard from "./BeneficiariePage/BeneficiarieDashboard";

const MainContent = ({userData, currentPage}) => {
    if (currentPage === 'TransactionPage') {
        axios.get('/api/users/cacheloadtransactions', { withCredentials: true }).catch(console.error);
    }
    return (
        <>
            <div className="main-content">
                <Topbar userData={userData}/>
                {currentPage === 'OverviewPage' ? (
                    <>
                        <OverviewBalance userData={userData}/>
                        <OverviewButtons userData={userData}/>
                        <OverviewTransactions />
                    </>
                ): currentPage === 'ProfilePage' ? (
                    <>
                        <ProfileInfo userData={userData}/>
                    </>
                ): currentPage === 'TransactionPage' ? (
                    <>
                        <TransactionButton userData={userData}/>
                        <TransactionDashboard />
                    </>
                ): currentPage === 'BeneficiariePage' ? (
                    <>
                        <BeneficiarieDashboard />
                    </>
                ): null}
            </div>
        </>
    )
};

export default MainContent;