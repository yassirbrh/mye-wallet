import React, { useState, useEffect } from "react";

const CreateReportDashboard = () => {
	const [reports, setReports] = useState([]);
	const [pageSize, setPageSize] = useState(10); // Default items per page
	const [currentPage, setCurrentPage] = useState(1);
	const [paginatedData, setPaginatedData] = useState([]);
	const [selectedReport, setSelectedReport] = useState(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [searchCriteria, setSearchCriteria] = useState({
		state: "",
		date: ""
	});

	useEffect(() => {
		fetch("/api/requests/getreports")
			.then((res) => res.json())
			.then((data) => {
				setReports(data);
				setCurrentPage(1); // Reset to the first page
				paginateData(data, pageSize);
			})
			.catch((error) => console.error("Error fetching reports:", error));
	}, [pageSize]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			const dropdownContent = document.querySelector(".dropdown-content");
			if (dropdownContent && !dropdownContent.contains(event.target)) {
				setIsDropdownOpen(false); // Close the dropdown if click is outside
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);


	const paginateData = (data, size) => {
		if (size === Infinity) {
			setPaginatedData([data]);
		} else {
			const paginated = [];
			for (let i = 0; i < data.length; i += size) {
				paginated.push(data.slice(i, i + size));
			}
			setPaginatedData(paginated);
		}
	};

	const totalPages = paginatedData.length;

	const handlePageSizeChange = (value) => {
		if (value === "all") {
			setPageSize(Infinity);
		} else {
			setPageSize(Number(value));
		}
	};

	const handlePageChange = (page) => {
		if (page === "<") setCurrentPage((prev) => Math.max(prev - 1, 1));
		else if (page === ">") setCurrentPage((prev) => Math.min(prev + 1, totalPages));
		else setCurrentPage(page);
	};

	const handleReportClick = (report) => {
		setSelectedReport(report);
		setIsDropdownOpen(true); // Open the dropdown when a transaction is clicked
	};

	const handleCloseDetails = () => {
		setSelectedReport(null);
		setIsDropdownOpen(false); // Close the dropdown when details are closed
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setSearchCriteria((prev) => ({ ...prev, [name]: value }));
	};

	const handleSearch = () => {
		const { state, date } = searchCriteria;
		const dateObj = new Date(date);
		const formattedDate = dateObj.toLocaleDateString("en-GB", {
			day: "numeric",
			month: "short",
			year: "numeric"
		});

		const filteredReports = reports.filter((report) => {
			
			if (state && !["unchecked", "checked", "answered"].includes(state)) {
				console.warn(`Invalid state value: ${state}`);
				return false;
			}
			if (state && report.state !== state) return false;
		
			if (date && formattedDate && report.doneAt !== formattedDate) return false;
		
			return true;
		});
		

		setPaginatedData([]);
		paginateData(filteredReports, pageSize);
		setCurrentPage(1);
	};

	return (
		<>
		<div
		className="dashboard"
		style={{
			display: "flex",
				justifyContent: "center",
				alignItems: "center",
				gap: "10px",
				margin: "20px 0",
		}}
		>
		<select
		name="state"
		value={searchCriteria.state}
		onChange={handleInputChange}
		style={{
			padding: "5px 10px",
				border: "1px solid #ccc",
				borderRadius: "5px",
				width: "150px",
		}}
		>
		<option value="">State</option>
		<option value="unchecked">Unchecked</option>
		<option value="checked">Checked</option>
		<option value="answered">Answered</option>
		</select>
		<input
		type="date"
		name="date"
		value={searchCriteria.date}
		onChange={handleInputChange}
		style={{
			padding: "5px 10px",
				border: "1px solid #ccc",
				borderRadius: "5px",
				width: "150px",
		}}
		/>
		<button
		onClick={handleSearch}
		style={{
			padding: "5px 20px",
				border: "none",
				borderRadius: "5px",
				backgroundColor: "#44c1f7",
				color: "white",
				cursor: "pointer",
		}}
		>
		Search
		</button>
		</div>

		{/* Transaction list and details modal remain the same */}
		<div className="dashboard">
		<div className="card" style={{ flex: 2, position: "relative" }}>
		<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
		<h3>Recent Reports</h3>
		<select
		onChange={(e) => handlePageSizeChange(e.target.value)}
		value={pageSize === Infinity ? "all" : pageSize}
		style={{
			padding: "5px 10px",
				border: "1px solid #ccc",
				borderRadius: "5px",
		}}
		>
		{[10, 20, 30, 40, 50, 60, 70, 80, 90, "all"].map((value) => (
			<option key={value} value={value}>
			{value}
			</option>
		))}
		</select>
		</div>

		<div className="transactions">
		{paginatedData[currentPage - 1]?.map((report, index) => (
			<div
			key={index}
			className="transaction-item"
			onClick={() => handleReportClick(report)}
			style={{
				padding: "10px",
					margin: "5px 0",
					border: "1px solid #ccc",
					borderRadius: "5px",
					cursor: "pointer",
					transition: "background-color 0.2s",
			}}
			onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
			onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
			>
			<div>
			<div className="desc">{report.reportName}</div>
			<div className="date">
  				{report.state && (
    				<span
      					style={{
        					color: "grey"
      					}}
    				>
      				{report.doneAt}
    				</span>
  				)}
			</div>
			</div>
			<div style={{
        		color:
          		report.state === "unchecked"
            	? "black"
            	: report.state === "checked"
            	? "green"
            	: "red",
      		}}>
			{`${report.state}`}
			</div>
			</div>
		))}
		</div>

		{isDropdownOpen && selectedReport && (
  <div 
    className="dropdown-container" 
    style={{ 
      position: "fixed", 
      top: "0", 
      left: "0", 
      width: "100vw", 
      height: "100vh", 
      zIndex: 9999, 
      display: "flex",
      justifyContent: "center", 
      alignItems: "center",
    }}
  >
    {/* Full-screen overlay with blur effect */}
    <div 
      className="dropdown-overlay" 
      style={{ 
        position: "absolute", 
        top: 0, 
        left: 0, 
        width: "100%", 
        height: "100%", 
        backgroundColor: "rgba(0, 0, 0, 0.5)", 
        backdropFilter: "blur(10px)", 
        zIndex: -1 
      }} 
    />
    {/* Dropdown content */}
    <div 
      className="dropdown-content" 
      style={{
        backgroundColor: "white", 
        borderRadius: "8px", 
        padding: "20px", 
        zIndex: 1, 
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        textAlign: "center", 
        maxWidth: "500px", 
        width: "80%", 
      }}
    >
      {/* Common text style */}
      <style>
        {`
          .info-text {
            font-size: 1.2em;
            color: #333;
            margin-bottom: 20px;
            line-height: 1.5;
          }
          .status-received {
            color: green;
          }
          .status-sent {
            color: red;
          }
          .failed-status {
            color: red;
            font-weight: bold;
          }
        `}
      </style>

      {/* Transaction ID */}
      <p className="info-text">
         Report ID: <strong>{selectedReport._id}</strong>
        {!selectedReport.state && (
          <span className="failed-status"> (pending)</span>
        )}
      </p>

      {/* Amount with dynamic color */}
      <p className="info-text">
        Type: <strong>{selectedReport.reportType}</strong>
      </p>

	  <p className="info-text">
        Message: <strong>{selectedReport.reportMessage}</strong>
      </p>

      <p className="info-text">
        State: <strong>{selectedReport.state}</strong>
      </p>

	  {selectedReport.state === "answered" && (
	  	<p className="info-text">
			Answer: <strong>{selectedReport.answer}</strong>
	  	</p>
	  )}

      {/* Close button */}
      <button 
        onClick={handleCloseDetails} 
        style={{
          padding: "10px 20px",
          backgroundColor: "#44c1f7", 
          color: "white", 
          border: "none", 
          borderRadius: "5px", 
          cursor: "pointer", 
          fontSize: "1em", 
          transition: "background-color 0.3s",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        Close Details
      </button>
    </div>
  </div>
)}






		<div style={{ display: "flex", justifyContent: "center", gap: "5px", marginTop: "20px" }}>
		<button
		onClick={() => handlePageChange("<")}
		style={{
			padding: "5px 10px",
				borderRadius: "5px",
				backgroundColor: "#44c1f7",
				color: "white",
				cursor: "pointer",
		}}
		>
		&lt;
		</button>
		{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
			<button
			key={page}
			onClick={() => handlePageChange(page)}
			style={{
				padding: "5px 10px",
					border: "1px solid #ccc",
					borderRadius: "5px",
					backgroundColor: currentPage === page ? "#44c1f7" : "white",
					color: currentPage === page ? "white" : "black",
					cursor: "pointer",
			}}
			>
			{page}
			</button>
		))}
		<button
		onClick={() => handlePageChange(">")}
		style={{
			padding: "5px 10px",
				borderRadius: "5px",
				backgroundColor: "#44c1f7",
				color: "white",
				cursor: "pointer",
		}}
		>
		&gt;
		</button>
		</div>
		</div>
		</div>
		</>
	);
};

export default CreateReportDashboard;
