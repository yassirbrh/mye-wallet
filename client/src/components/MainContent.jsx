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
import AmountDemandButton from "./AmountDemandPage/AmountDemandButton";
import AmountDemandDashboard from "./AmountDemandPage/AmountDemandDashboard";
import CreateReportDashboard from "./ReportPage/CreateReportDashboard";
import CreateReportButton from './ReportPage/CreateReportButton';

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
                ): currentPage === 'AmountDemandPage' ? (
                    <>
                        <AmountDemandButton userData={userData}/>
                        <AmountDemandDashboard />
                    </>
                ): currentPage === 'ReportPage' ? (
                    <>
                        <CreateReportButton userData={userData}/>
                        <CreateReportDashboard />
                    </>
                ): null}
            </div>
        </>
    )
};

export default MainContent;