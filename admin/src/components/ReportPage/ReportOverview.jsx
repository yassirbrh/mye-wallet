import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReportOverview = () => {
  const [selectedTab, setSelectedTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [answeredReports, setAnsweredReports] = useState([]);
  const [pendingReports, setPendingReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedReport, setExpandedReport] = useState(null);
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await axios.get("/api/admin/reports");
        setAnsweredReports(data.filter(report => report.state !== "unchecked"));
        setPendingReports(data.filter(report => report.state === "unchecked"));
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleExpandReport = (reportID) => {
    setExpandedReport(prev => (prev === reportID ? null : reportID));
    if (responseText !== '') setResponseText('');
  };

  const handleSubmitResponse = async (reportID) => {
    if (!responseText.trim()) {
      toast.error("Response cannot be empty.");
      return;
    }

    try {
      const { data } = await axios.post("/api/admin/check-report", { reportID, responseText });

      setPendingReports(prev => prev.filter(report => report._id !== reportID));
      setAnsweredReports(prev => [
        ...prev,
        { ...pendingReports.find(report => report._id === reportID), state: "answered", responseText },
      ]);

      setResponseText("");
      setExpandedReport(null);
      toast.success(data.message || "Response submitted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const filteredReports = (selectedTab === "pending" ? pendingReports : answeredReports).filter(report =>
    report.userID.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <>Loading...</>;

  return (
    <div style={{ padding: "20px", fontFamily: "Poppins, sans-serif" }}>
      {/* Toggle Buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", justifyContent: "center" }}>
        {["pending", "previous"].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            style={{
              padding: "12px 20px",
              background: selectedTab === tab ? "#3498db" : "#ddd",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "500",
              boxShadow: selectedTab === tab ? "0px 4px 6px rgba(0,0,0,0.1)" : "none",
              transition: "0.3s",
            }}
          >
            {tab === "pending" ? "Pending Reports" : "Previous Reports"}
          </button>
        ))}
      </div>

      {/* Search Box */}
      <input
        type="text"
        placeholder="🔍 Search by username..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
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

      {/* Report List */}
      <div style={{ overflowX: "auto", borderRadius: "10px", boxShadow: "0px 3px 8px rgba(0,0,0,0.1)" }}>
        <ul style={{ listStyleType: "none", padding: "0", width: "100%" }}>
          <li style={{ background: "#3498db", color: "#fff", padding: "10px", textAlign: "center", fontWeight: "bold" }}>
            {selectedTab === "pending" ? "Pending Reports" : "Previous Reports"}
          </li>
          {filteredReports.map(report => (
            <li
              key={report._id}
              style={{
                borderBottom: "1px solid #ddd",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>
                  Report from: {report.userID.userName} <span style={{ color: "#777" }}>(Type: {report.reportType})</span>
                </span>
                {selectedTab === "pending" ? (
                  <button
                    onClick={() => handleExpandReport(report._id)}
                    style={{
                      padding: "6px 12px",
                      background: expandedReport === report._id ? "#e74c3c" : "#3498db",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "5px",
                      transition: "0.3s",
                    }}
                  >
                    {expandedReport === report._id ? "Close" : "Check Report"}
                  </button>
                ) : (
                  <span
                    style={{
                      padding: "6px 12px",
                      background: report.state === "answered" ? "#2ecc71" : "#e74c3c",
                      color: "#fff",
                      borderRadius: "5px",
                      textTransform: "capitalize",
                      fontWeight: "bold",
                    }}
                  >
                    {report.state}
                  </span>
                )}
              </div>

              {expandedReport === report._id && (
                <div style={{ background: "#f9f9f9", padding: "10px", borderRadius: "8px", marginTop: "5px" }}>
                  <h4 style={{ marginBottom: "10px", color: "#333" }}>Report Details</h4>
                  <p><strong>Username:</strong> {report.userID.userName}</p>
                  <p><strong>Full Name:</strong> {report.userID.firstName} {report.userID.lastName}</p>
                  <p><strong>Report Message:</strong> {report.reportMessage}</p>
                  <p><strong>Report Type:</strong> {report.reportType}</p>
                  <p><strong>State:</strong> {report.state}</p>
                  <p><strong>Done At:</strong> {formatDate(report.doneAt)}</p>

                  {/* Response Form */}
                  <div style={{ marginTop: "15px" }}>
                    <h4 style={{ marginBottom: "10px", color: "#333" }}>Response</h4>
                    <textarea
                      rows="4"
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Write your response..."
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        resize: "none",
                      }}
                    />
                    <button
                      onClick={() => handleSubmitResponse(report._id)}
                      style={{
                        marginTop: "10px",
                        padding: "8px 14px",
                        background: "#2ecc71",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "6px",
                        transition: "0.3s",
                      }}
                    >
                      Submit Response
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ReportOverview;
