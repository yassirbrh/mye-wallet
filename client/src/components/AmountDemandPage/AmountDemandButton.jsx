import React, { useState } from 'react';
import OverviewDropdown from '../OverviewPage/OverviewDropdown';
import useAmountRequest from '../../hooks/useAmountRequest';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AmountDemandButton = ({ userData }) => {
  const [isAmountDemandDropdownOpen, setAmountDemandDropdownOpen] = useState(false);
  const { inputAmount, handleInputChange, handleSubmit } = useAmountRequest();

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

  const inputStyle = {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '100%',
    maxWidth: '300px',
    fontSize: '16px',
    margin: '10px 0',
    boxSizing: 'border-box',
    outline: 'none',
  };

  const submitButtonStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#27ae60',
    color: 'white',
    cursor: 'pointer',
  };

  return (
    <>
      <div className="dashboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', margin: '20px 0' }}>
        <button style={buttonStyle} onClick={() => setAmountDemandDropdownOpen(true)}>
          <i className="bx bx-plus" style={{ fontSize: '16px' }}></i> New Amount Demand
        </button>
      </div>

      <ToastContainer />

      {/* Transaction Dropdown */}
      <OverviewDropdown isOpen={isAmountDemandDropdownOpen} onClose={() => setAmountDemandDropdownOpen(false)}>

        <p>Enter the amount you want to request</p>
        <input type="number" value={inputAmount} onChange={handleInputChange} placeholder="Enter Amount" style={inputStyle} />

        <button onClick={handleSubmit} style={submitButtonStyle}>
          Send
        </button>
      </OverviewDropdown>
    </>
  );
};

export default AmountDemandButton;
