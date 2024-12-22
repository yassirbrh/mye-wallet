import React, { useState, useEffect } from "react";

const AmountDemandDashboard = () => {
	const [demands, setDemands] = useState([]);
	const [pageSize, setPageSize] = useState(10); // Default items per page
	const [currentPage, setCurrentPage] = useState(1);
	const [paginatedData, setPaginatedData] = useState([]);
	const [selectedDemand, setSelectedDemand] = useState(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [searchCriteria, setSearchCriteria] = useState({
		minAmount: "",
		maxAmount: "",
		state: "",
		date: "",
	});

	useEffect(() => {
		fetch("/api/requests/getbalancerequests")
			.then((res) => res.json())
			.then((data) => {
				setDemands(data);
				setCurrentPage(1); // Reset to the first page
				paginateData(data, pageSize);
			})
			.catch((error) => console.error("Error fetching demands:", error));
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

	const handleDemandClick = (demand) => {
		setSelectedDemand(demand);
		setIsDropdownOpen(true); // Open the dropdown when a transaction is clicked
	};

	const handleCloseDetails = () => {
		setSelectedDemand(null);
		setIsDropdownOpen(false); // Close the dropdown when details are closed
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setSearchCriteria((prev) => ({ ...prev, [name]: value }));
	};

	const handleSearch = () => {
		const { minAmount, maxAmount, state, date } = searchCriteria;
		const min = parseFloat(minAmount);
		const max = parseFloat(maxAmount);
		const dateObj = new Date(date);
		const formattedDate = dateObj.toLocaleDateString("en-GB", {
			day: "numeric",
			month: "short",
			year: "numeric"
		});

		// Validate criteria
		if (minAmount && maxAmount && min > max) {
			alert("Minimum amount cannot be greater than maximum amount.");
			return;
		}

		const filteredDemands = demands.filter((demand) => {
			if (minAmount && demand.amount < minAmount) return false;
			if (maxAmount && demand.amount > maxAmount) return false;
			
			if (state && !["accepted", "denied", "pending"].includes(state)) {
				console.warn(`Invalid state value: ${state}`);
				return false;
			}
			if (state && demand.state !== state) return false;
		
			if (date && formattedDate && demand.doneAt !== formattedDate) return false;
		
			return true;
		});
		

		setPaginatedData([]);
		paginateData(filteredDemands, pageSize);
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
		<input
		type="number"
		placeholder="Min Amount"
		name="minAmount"
		value={searchCriteria.minAmount}
		onChange={handleInputChange}
		style={{
			padding: "5px 10px",
				border: "1px solid #ccc",
				borderRadius: "5px",
				width: "150px",
		}}
		/>
		<input
		type="number"
		placeholder="Max Amount"
		name="maxAmount"
		value={searchCriteria.maxAmount}
		onChange={handleInputChange}
		style={{
			padding: "5px 10px",
				border: "1px solid #ccc",
				borderRadius: "5px",
				width: "150px",
		}}
		/>
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
		<option value="accepted">Accepted</option>
		<option value="denied">Denied</option>
		<option value="pending">Pending</option>
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
		<h3>Recent Demands</h3>
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
		{paginatedData[currentPage - 1]?.map((demand, index) => (
			<div
			key={index}
			className="transaction-item"
			onClick={() => handleDemandClick(demand)}
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
			<div className="desc">{demand.doneAt}</div>
			<div className="date">
  				{demand.state && (
    				<span
      					style={{
        					color:
          						demand.state === "pending"
            					? "black"
            					: demand.state === "accepted"
            					? "green"
            					: "red",
      					}}
    				>
      				({demand.state})
    				</span>
  				)}
			</div>
			</div>
			<div className={"amount"}>
			{`$${demand.amount.toFixed(2)}`}
			</div>
			</div>
		))}
		</div>

		{isDropdownOpen && selectedDemand && (
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
         Demand ID: <strong>{selectedDemand._id}</strong>
        {!selectedDemand.state && (
          <span className="failed-status"> (pending)</span>
        )}
      </p>

      {/* Amount with dynamic color */}
      <p 
        className={`info-text ${
          selectedDemand.state === 'accepted' 
            ? 'status-received' 
            : selectedDemand.state === 'denied' 
              ? 'status-sent' 
              : 'pending'
        }`}
      >
        Amount: <strong>{selectedDemand.amount}</strong>
      </p>

      <p className="info-text">
        State: <strong>{selectedDemand.state}</strong>
      </p>

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

export default AmountDemandDashboard;
