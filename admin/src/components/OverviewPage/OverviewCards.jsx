import React from "react";
import useOverviewCards from "../../hooks/useOverviewCards";

const OverviewCards = () => {
    const { data, loading } = useOverviewCards();
    if (loading) return <> loading...</>
    const {requests, reports, assistances, creditcards, amountdemands} = data;
    return (
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        {/* Recent Requests */}
        <div style={{ flex: "1 1 30%", padding: "16px", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>Pending Requests</h4>
            <a href="/users" style={{ textDecoration: "none", color: "#3498db", fontSize: "14px" }}>Go to Requests</a>
          </div>
          <ul style={{ 
            listStyle: "none", 
            padding: 0, 
            fontSize: "14px", 
            color: "#555", 
            textAlign: Object.keys(requests).length === 0 ? "center" : "left" 
          }}>
            {Object.keys(requests).length > 0 ? (
              Object.entries(requests).map(([key, value]) => (
                <li
                  style={{ 
                    padding: "8px 0", 
                    borderBottom:  "1px solid #ddd", 
                    display: "flex", 
                    justifyContent: "space-between" 
                  }}
                >
                  {key} <span style={{ color: "#777" }}>{value}</span>
                </li>
              ))
            ) : (
              <li style={{ padding: "20px 0", color: "#999" }}>No New Requests</li>
            )}
          </ul>
        </div>

        {/* Latest Users */}
        <div style={{ flex: "1 1 30%", padding: "16px", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>Pending Reports</h4>
            <a href="/users" style={{ textDecoration: "none", color: "#2ecc71", fontSize: "14px" }}>Go to Reports</a>
          </div>
          <ul style={{ 
            listStyle: "none", 
            padding: 0, 
            fontSize: "14px", 
            color: "#555", 
            textAlign: Object.keys(reports).length === 0 ? "center" : "left" 
          }}>
            {Object.keys(reports).length > 0 ? (
              Object.entries(reports).map(([key, value]) => (
                <li
                  style={{ 
                    padding: "8px 0", 
                    borderBottom:  "1px solid #ddd", 
                    display: "flex", 
                    justifyContent: "space-between" 
                  }}
                >
                  {key} <span style={{ color: "#777" }}>{value}</span>
                </li>
              ))
            ) : (
              <li style={{ padding: "20px 0", color: "#999" }}>No New Reports</li>
            )}
          </ul>
        </div>

        {/* Recent Transactions */}
        <div style={{ flex: "1 1 30%", padding: "16px", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>Assistance Requests</h4>
            <a href="/assistance" style={{ textDecoration: "none", color: "#e74c3c", fontSize: "14px", display: "flex", alignItems: "center" }}>
              <i className="bx bx-transfer" style={{ marginRight: "4px" }}></i> Go to Assistance
            </a>
          </div>
          <ul style={{ 
            listStyle: "none", 
            padding: 0, 
            fontSize: "14px", 
            color: "#555", 
            textAlign: Object.keys(assistances).length === 0 ? "center" : "left" 
          }}>
            {Object.keys(assistances).length > 0 ? (
              Object.entries(assistances).map(([key, value]) => (
                <li
                  style={{ 
                    padding: "8px 0", 
                    borderBottom:  "1px solid #ddd", 
                    display: "flex", 
                    justifyContent: "space-between" 
                  }}
                >
                  {key} <span style={{ color: "#777" }}>{value}</span>
                </li>
              ))
            ) : (
              <li style={{ padding: "20px 0", color: "#999" }}>No New Assistance Requests</li>
            )}
          </ul>
        </div>

        {/* Pending Approvals */}
        <div style={{ flex: "1 1 30%", padding: "16px", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>Pending Amount Demands</h4>
            <a href="/amount-demands" style={{ textDecoration: "none", color: "#f39c12", fontSize: "14px" }}>Go to Amount Demands</a>
          </div>
          <ul style={{ 
            listStyle: "none", 
            padding: 0, 
            fontSize: "14px", 
            color: "#555", 
            textAlign: Object.keys(amountdemands).length === 0 ? "center" : "left" 
          }}>
            {Object.keys(amountdemands).length > 0 ? (
              Object.entries(amountdemands).map(([key, value]) => (
                <li
                  style={{ 
                    padding: "8px 0", 
                    borderBottom:  "1px solid #ddd", 
                    display: "flex", 
                    justifyContent: "space-between" 
                  }}
                >
                  {key} <span style={{ color: "#777" }}>{value}</span>
                </li>
              ))
            ) : (
              <li style={{ padding: "20px 0", color: "#999" }}>No New Amount Demands</li>
            )}
          </ul>
        </div>

        {/* System Logs */}
        <div style={{ flex: "1 1 30%", padding: "16px", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>Pending Credit Cards Requests</h4>
            <a href="/logs" style={{ textDecoration: "none", color: "#9b59b6", fontSize: "14px" }}>Go to Credit Cards</a>
          </div>
          <ul style={{ 
            listStyle: "none", 
            padding: 0, 
            fontSize: "14px", 
            color: "#555", 
            textAlign: Object.keys(creditcards).length === 0 ? "center" : "left" 
          }}>
            {Object.keys(creditcards).length > 0 ? (
              Object.entries(creditcards).map(([key, value]) => (
                <li
                  style={{ 
                    padding: "8px 0", 
                    borderBottom:  "1px solid #ddd", 
                    display: "flex", 
                    justifyContent: "space-between" 
                  }}
                >
                  {key} <span style={{ color: "#777" }}>{value}</span>
                </li>
              ))
            ) : (
              <li style={{ padding: "20px 0", color: "#999" }}>No New Credit Cards Requests</li>
            )}
          </ul>
        </div>
      </div>
    );
};

export default OverviewCards;
