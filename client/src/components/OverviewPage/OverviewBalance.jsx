import React from "react";

const OverviewBalance = ({userData}) => {
    return (
        <>
            <div className="dashboard">
                <div className="card">
                    <h3>Current Balance</h3>
                    <div className="amount">${userData.balance}</div>
                </div>
                <div className="card">
                    <h3>Amount In Demand</h3>
                    <div className="amount">${userData.amountInDemands}</div>
                </div>
            </div>
        </>
    )
};

export default OverviewBalance;