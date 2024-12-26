import React, { useState } from 'react';
import OverviewDropdown from '../OverviewPage/OverviewDropdown';
import useCreateReport from '../../hooks/useCreateReport';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateReportButton = ({ userData }) => {
  const [isCreateReportDropdownOpen, setCreateReportDropdownOpen] = useState(false);
  const { reportMessage, setReportMessage, selectedReportType, setSelectedReportType, handleSubmit } = useCreateReport();

  const buttonStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#27ae60',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  };

  return (
    <>
      <div className="dashboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', margin: '20px 0' }}>
        <button style={buttonStyle} onClick={() => setCreateReportDropdownOpen(true)}>
          <i className="bx bx-plus" style={{ fontSize: '16px' }}></i> New Report
        </button>
      </div>

      <ToastContainer />

      {/* Report Dropdown */}
      <OverviewDropdown 
        isOpen={isCreateReportDropdownOpen} 
        onClose={() => setCreateReportDropdownOpen(false)}
      >
        <p>Select an Issue Type and Describe Your Problem</p>
  
        {/* Dropdown for selecting report type */}
        <select 
          value={selectedReportType} 
          onChange={(e) => setSelectedReportType(e.target.value)} 
          style={{
            padding: "10px",
            margin: "10px 0",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "100%",
          }}
        >
          <option value="" disabled>Select an Issue</option>
          <option value="login_issue">Login Issue</option>
          <option value="transaction_failure">Transaction Failure</option>
          <option value="app_crash">App Crash</option>
          <option value="slow_performance">Slow Performance</option>
          <option value="balance_inaccuracy">Balance Inaccuracy</option>
          <option value="notification_error">Notification Error</option>
          <option value="data_sync_problem">Data Sync Problem</option>
          <option value="unauthorized_access">Unauthorized Access</option>
          <option value="feature_request">Feature Request</option>
          <option value="other">Other</option>
        </select>

        {/* Textarea for entering report message */}
        <textarea 
          value={reportMessage} 
          onChange={(e) => setReportMessage(e.target.value)} 
          placeholder="Describe the issue in detail" 
          style={{
            width: "100%",
            height: "150px",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        {/* Submit button */}
        <button 
          onClick={handleSubmit} 
          style={{
            padding: "10px 20px",
            backgroundColor: "#44c1f7",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Submit Report
        </button>
      </OverviewDropdown>
    </>
  );
};

export default CreateReportButton;
