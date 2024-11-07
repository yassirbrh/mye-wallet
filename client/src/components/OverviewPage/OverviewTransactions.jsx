import React from "react";
import useUserTransactions from "../../hooks/useUserTransactions";

const OverviewTransactions = () => {
    const userTransactions = useUserTransactions();
    return (
        <>
            <div className="dashboard">
                <div className="card" style={{ flex: 2 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Recent Transactions</h3>
                        <a href="/transactions" style={{ textDecoration: 'none', color: '#007bff' }}>Go to Transactions</a>
                    </div>
                    <div className="transactions">
                        {userTransactions.map((transaction, index) => {
                            const isReceived = transaction.status === "received";
                            const amountClass = isReceived ? "amount" : "amount negative";
                            const amountSign = isReceived ? "+" : "-";
                            const amountDisplay = `${amountSign}$${transaction.transactionBalance.toFixed(2)}`;

                            return (
                                <div className="transaction-item" key={index}>
                                    <div>
                                        <div className="desc">
                                            {transaction.operatorUsername}
                                            {transaction.isDone === false && <span style={{ color: 'red' }}> (failed)</span>}
                                        </div>
                                        <div className="date">{transaction.doneAt}</div>
                                    </div>
                                    <div className={amountClass}>{amountDisplay}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    )
};

export default OverviewTransactions;