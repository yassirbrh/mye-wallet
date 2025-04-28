import React from "react";
import useDashboardStats from "../../hooks/useDashboardStats";

const OverviewDashboard = () => {
    const stats = useDashboardStats();
    if (stats.loading) return <p>Loading...</p>
    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <div
                  style={{
                    flex: 1,
                    padding: "20px",
                    background: "linear-gradient(135deg, #3498db, #2980b9)",
                    color: "#fff",
                    borderRadius: "12px",
                    textAlign: "center",
                    marginRight: "10px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 500 }}>
                    <i className="bx bx-user" style={{ fontSize: "22px", marginRight: "8px" }}></i>Users
                  </h3>
                  <p style={{ margin: "5px 0", fontSize: "28px", fontWeight: "bold" }}>{stats.data['users']}</p>
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: "20px",
                    background: "linear-gradient(135deg, #2ecc71, #27ae60)",
                    color: "#fff",
                    borderRadius: "12px",
                    textAlign: "center",
                    marginRight: "10px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 500 }}>
                    <i className="bx bx-line-chart" style={{ fontSize: "22px", marginRight: "8px" }}></i>Reports
                  </h3>
                  <p style={{ margin: "5px 0", fontSize: "28px", fontWeight: "bold" }}>{stats.data['reports']}</p>
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: "20px",
                    background: "linear-gradient(135deg, #e74c3c, #c0392b)",
                    color: "#fff",
                    borderRadius: "12px",
                    textAlign: "center",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    position: "relative",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "18px",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i className="bx bx-credit-card" style={{ fontSize: "22px", marginRight: "8px" }}></i>
                    Credit Cards
                  </h3>
                  <p style={{ margin: "5px 0", fontSize: "28px", fontWeight: "bold" }}>{stats.data['creditcards']}</p>
                </div>
                <div
                    style={{
                      flex: 1,
                      padding: "20px",
                      background: "linear-gradient(135deg, #f39c12, #e67e22)",
                      color: "#fff",
                      borderRadius: "12px",
                      textAlign: "center",
                      marginLeft: "10px",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    }}
                >
                  <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 500 }}>
                    <i className="bx bx-money" style={{ fontSize: "22px", marginRight: "8px" }}></i>
                    Total Transaction Volume
                  </h3>
                  <p style={{ margin: "5px 0", fontSize: "28px", fontWeight: "bold" }}>{stats.data['transactions']}$</p>
                </div>
            </div>
        </>
    )
};

export default OverviewDashboard;