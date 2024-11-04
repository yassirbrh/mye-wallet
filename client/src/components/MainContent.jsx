import React, { useState } from "react";
import Topbar from "./Bars/Topbar";
import OverviewBalance from "./OverviewPage/OverviewBalance";
import OverviewButtons from "./OverviewPage/OverviewButtons";
import OverviewTransactions from "./OverviewPage/OverviewTransactions";
import ProfileInfo from "./ProfilePage/ProfileInfo";

const MainContent = ({userData, currentPage}) => {
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
                ): null}
            </div>
        </>
    )
};

export default MainContent;