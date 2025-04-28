import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AmountDemandOverview = () => {
  const [selectedOption, setSelectedOption] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalData, setModalData] = useState(null);
  const [previousDemands, setPreviousDemands] = useState([]);
  const [pendingDemands, setPendingDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchRequests = async () => {
        try {
            const response = await axios.get('/api/admin/getamountdemands');
            setPreviousDemands(response.data.filter(demand => demand.state !== undefined));
            setPendingDemands(response.data.filter(demand => demand.state === undefined));
        } finally {
            setLoading(false)
        }
    }
    fetchRequests();
  }, []);

  const processDemand = async (action, demandID) => {
    try {
      const response = await axios.post('/api/admin/process-amount-demands', { demandID, action });
  
      setPendingDemands((prev) => prev.filter((demand) => demand._id !== demandID));
  
      setPreviousDemands((prev) => [
        ...prev,
        {
          ...pendingDemands.find((demand) => demand._id === demandID),
          state: action === "accept" ? "accepted" : "denied",
        },
      ]);
  
      toast.success(response.data.message || "Action processed successfully!");
  
    } catch (error) {
      console.error("Error processing demand:", error);
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };
  
  


  const filteredData =
    selectedOption === "pending"
      ? pendingDemands.filter((demand) =>
          demand.userID.userName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : previousDemands.filter((demand) =>
          demand.userID.userName.toLowerCase().includes(searchTerm.toLowerCase())
        );
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalData(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return <>loading...</>

  return (
    <div style={{ padding: "20px", fontFamily: "Poppins, sans-serif" }}>
      {/* Toggle Buttons */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => setSelectedOption("pending")}
          style={{
            padding: "12px 20px",
            background: selectedOption === "pending" ? "#3498db" : "#ddd",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "500",
            boxShadow: selectedOption === "pending" ? "0px 4px 6px rgba(0,0,0,0.1)" : "none",
            transition: "0.3s",
          }}
        >
          Pending Demands
        </button>
        <button
          onClick={() => setSelectedOption("previous")}
          style={{
            padding: "12px 20px",
            background: selectedOption === "previous" ? "#3498db" : "#ddd",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "500",
            boxShadow: selectedOption === "previous" ? "0px 4px 6px rgba(0,0,0,0.1)" : "none",
            transition: "0.3s",
          }}
        >
          Previous Demands
        </button>
      </div>

      {/* Search Box */}
      <input
        type="text"
        placeholder="🔍 Search by username..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginBottom: "15px",
          fontSize: "14px",
          boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
        }}
      />

      {/* Data Table */}
      <div style={{ overflowX: "auto", borderRadius: "10px", boxShadow: "0px 3px 8px rgba(0,0,0,0.1)" }}>
        <ul style={{ listStyleType: "none", padding: "0", width: "100%" }}>
            <li
              style={{
                background: "#3498db",
                color: "#fff",
                padding: "10px",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {selectedOption === "pending" ? "Pending Demands" : "Previous Demands"}
            </li>
            {filteredData.map((item) => (
              <li
                key={item._id}
                style={{
                  borderBottom: "1px solid #ddd",
                  padding: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  {item.userID.userName}{" "}
                  <span style={{ color: "#777" }}>
                    ({item.amount}$)
                  </span>
                </span>
                <span>
                  {selectedOption === "pending" ? (
                    <>
                      <button
                        onClick={() => processDemand('accept', item._id)}
                        style={{
                          padding: "6px 12px",
                          marginRight: "5px",
                          background: "#2ecc71",
                          color: "#fff",
                          border: "none",
                          cursor: "pointer",
                          borderRadius: "5px",
                          transition: "0.3s",
                        }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => processDemand('deny', item._id)}
                        style={{
                          padding: "6px 12px",
                          background: "#e74c3c",
                          color: "#fff",
                          border: "none",
                          cursor: "pointer",
                          borderRadius: "5px",
                          transition: "0.3s",
                        }}
                      >
                        Deny
                      </button>
                    </>
                  ) : (
                    <span
                      style={{
                        padding: "6px 12px",
                        background: item.state === "accepted" ? "#2ecc71" : "#e74c3c",
                        color: "#fff",
                        borderRadius: "5px",
                        textTransform: "capitalize",
                        fontWeight: "bold",
                      }}
                    >
                      {item.state}
                    </span>
                  )}
                </span>
              </li>
            ))}
        </ul>
      </div>

      {/* Modal */}
      {modalData && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      backdropFilter: "blur(8px)",
    }}
  >
    <div
      ref={modalRef}
      style={{
        background: "#fff",
        padding: "25px",
        borderRadius: "10px",
        width: "350px",
        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
        {modalData.type === "manage" ? "Manage User" : "Request Details"}
      </h2>

      <form style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <label>
          <strong>First Name:</strong>
          <input
            type="text"
            value={modalData.data.firstName}
            readOnly
            style={{
              width: "100%",
              padding: "6px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              background: "#f9f9f9",
            }}
          />
        </label>
        <label>
          <strong>Last Name:</strong>
          <input
            type="text"
            value={modalData.data.lastName}
            readOnly
            style={{
              width: "100%",
              padding: "6px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              background: "#f9f9f9",
            }}
          />
        </label>
        <label>
          <strong>Username:</strong>
          <input
            type="text"
            value={modalData.data.userName}
            readOnly
            style={{
              width: "100%",
              padding: "6px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              background: "#f9f9f9",
            }}
          />
        </label>
        <label>
          <strong>Email:</strong>
          <input
            type="email"
            value={modalData.data.email}
            readOnly
            style={{
              width: "100%",
              padding: "6px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              background: "#f9f9f9",
            }}
          />
        </label>
        <label>
          <strong>Gender:</strong>
          <input
            type="text"
            value={modalData.data.gender}
            readOnly
            style={{
              width: "100%",
              padding: "6px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              background: "#f9f9f9",
            }}
          />
        </label>
        <label>
          <strong>Birth Date:</strong>
          <input
            type="text"
            value={new Date(modalData.data.birthDate).toLocaleDateString("en-GB")}
            readOnly
            style={{
              width: "100%",
              padding: "6px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              background: "#f9f9f9",
            }}
          />
        </label>
      </form>

      <div
        style={{
          textAlign: "center",
          marginTop: "15px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >

        {modalData.type === "details" && (
          <>
            <button
              onClick={() => acceptUser(modalData.data.userName)}
              style={{
                padding: "8px 14px",
                background: "#2ecc71",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                borderRadius: "6px",
                transition: "0.3s",
              }}
            >
              Confirm Request
            </button>
            <button
              onClick={() => deleteUser(modalData.data.userName)}
              style={{
                padding: "8px 14px",
                background: "#e74c3c",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                borderRadius: "6px",
                transition: "0.3s",
              }}
            >
              Delete Request
            </button>
          </>
        )}
        <button
          onClick={() => setModalData(null)}
          style={{
            padding: "8px 14px",
            background: "#e74c3c",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "6px",
            transition: "0.3s",
          }}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
    <ToastContainer />
    </div>
  );
};

export default AmountDemandOverview;
