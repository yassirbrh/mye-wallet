import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserOverview = () => {
  const [selectedOption, setSelectedOption] = useState("Users");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalData, setModalData] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [requestsData, setRequestsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchRequests = async () => {
        try {
            const response = await Promise.all([
                axios.get('/api/admin/requests'),
                axios.get('/api/admin/getusers'),
            ]);
            const [requests, users] = response.map(res => res.data);
            setUsersData(users);
            setRequestsData(requests);
        } finally {
            setLoading(false)
        }
    }
    fetchRequests();
  }, []);

  const acceptUser = async (userName) => {
    try {
      await axios.post("/api/admin/acceptuser", { userName });
  
      setRequestsData((prevRequests) => {
        const userToMove = prevRequests.find((user) => user.userName === userName);
        if (!userToMove) return prevRequests;
  
        setUsersData((prevUsers) => [...prevUsers, userToMove]); // Add user to usersData
        return prevRequests.filter((user) => user.userName !== userName); // Remove from requestsData
      });
  
      toast.success("User accepted successfully!");
      setModalData(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to accept user. Please try again.");
    }
  };
  
  const deleteUser = async (userName) => {
    try {
      await axios.post("/api/admin/deleteuser", { userName });
  
      setRequestsData((prevRequests) =>
        prevRequests.filter((user) => user.userName !== userName)
      );
  
      setUsersData((prevUsers) =>
        prevUsers.filter((user) => user.userName !== userName)
      );
  
      toast.success("User deleted successfully!");
      setModalData(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user. Please try again.");
    }
  };


  const filteredData =
    selectedOption === "Users"
      ? usersData.filter((user) =>
          user.userName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : requestsData.filter((request) =>
          request.userName.toLowerCase().includes(searchTerm.toLowerCase())
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
          onClick={() => setSelectedOption("Users")}
          style={{
            padding: "12px 20px",
            background: selectedOption === "Users" ? "#3498db" : "#ddd",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "500",
            boxShadow: selectedOption === "Users" ? "0px 4px 6px rgba(0,0,0,0.1)" : "none",
            transition: "0.3s",
          }}
        >
          Users
        </button>
        <button
          onClick={() => setSelectedOption("Requests")}
          style={{
            padding: "12px 20px",
            background: selectedOption === "Requests" ? "#3498db" : "#ddd",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "500",
            boxShadow: selectedOption === "Requests" ? "0px 4px 6px rgba(0,0,0,0.1)" : "none",
            transition: "0.3s",
          }}
        >
          Requests
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
              {selectedOption === "Users" ? "Users" : "Pending Requests"}
            </li>
            {filteredData.map((item) => (
              <li
                key={item.userName}
                style={{
                  borderBottom: "1px solid #ddd",
                  padding: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  {item.userName}{" "}
                  <span style={{ color: "#777" }}>
                    ({item.email})
                  </span>
                </span>
                <span>
                  {selectedOption === "Users" ? (
                    <>
                      <button
                        onClick={() => setModalData({ type: "manage", data: item })}
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
                        Manage
                      </button>
                      <button
                        onClick={() => deleteUser(item.userName)}
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
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setModalData({ type: "details", data: item })}
                      style={{
                        padding: "6px 12px",
                        background: "#2ecc71",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "5px",
                        transition: "0.3s",
                      }}
                    >
                      View Details
                    </button>
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

export default UserOverview;
