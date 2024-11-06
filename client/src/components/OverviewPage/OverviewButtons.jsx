// OverviewButtons.js
import React, { useState } from 'react';
import OverviewDropdown from './OverviewDropdown';
import useAmountRequest from '../../hooks/useAmountRequest';
import useTransferMoney from '../../hooks/useTransferMoney';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OverviewButtons = ({userData}) => {
  const [isTransactionDropdownOpen, setTransactionDropdownOpen] = useState(false);
  const [isDemandDropdownOpen, setDemandDropdownOpen] = useState(false);
  const { inputAmount, handleInputChange, handleSubmit } = useAmountRequest();
  const { 
    amount, 
    handleTransferChange, 
    handleBeneficiaryChange, 
    message, 
    handleMessageChange, 
    handleTransferSubmit 
  } = useTransferMoney();
  // Common button styles
  const buttonStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  };

  const inputDemandStyle = {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '100%',
    maxWidth: '300px',
    fontSize: '16px',
    outline: 'none',
    margin: '10px 0',
    boxSizing: 'border-box',
  };

  const selectTransactionStyle = {
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

  const inputTransactionStyle = { 
    padding: '10px 20px', 
    border: 'none', 
    borderRadius: '5px', 
    backgroundColor: '#27ae60', 
    color: 'white', 
    cursor: 'pointer' 
  };
  
  return (
    <>
      <div className="dashboard" style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
        {/* New Transaction Button */}
        <button
          style={{ ...buttonStyle, backgroundColor: '#44c1f7' }}
          onClick={() => setTransactionDropdownOpen(true)}
        >
          <i className="bx bx-plus" style={{ fontSize: '16px' }}></i> New Transaction
        </button>

        {/* New Amount Demand Button */}
        <button
          style={{ ...buttonStyle, backgroundColor: '#27ae60' }}
          onClick={() => setDemandDropdownOpen(true)}
        >
          <i className="bx bx-plus" style={{ fontSize: '16px' }}></i> New Amount Demand
        </button>
      </div>

      <ToastContainer />

      {/* Transaction Dropdown */}
      <OverviewDropdown isOpen={isTransactionDropdownOpen} onClose={() => setTransactionDropdownOpen(false)}>
        <p>Choose the beneficiary</p>
        <select multiple style={selectTransactionStyle} onChange={handleBeneficiaryChange}>
        {userData.Beneficiaries.map((beneficiary, index) => (
          <option key={index} value={beneficiary}>
            {beneficiary}
          </option>
        ))}
        </select>
  
        <p>Enter the amount that you want to send</p>
        <input type="number" value={amount} onChange={handleTransferChange} placeholder="Enter Amount" style={inputDemandStyle}/>
        <p>Leave a message here</p>
        <input type="text" value={message} onChange={handleMessageChange} placeholder="Enter Message" style={inputDemandStyle}/>
        <button onClick={handleTransferSubmit} style={inputTransactionStyle}> Send </button>
      </OverviewDropdown>


      {/* Amount Demand Dropdown */}
      <OverviewDropdown isOpen={isDemandDropdownOpen} onClose={() => setDemandDropdownOpen(false)}>
        <p>Enter the amount that you want to request</p>
        <input type="number" value={inputAmount} onChange={handleInputChange} placeholder="Enter Amount" style={inputDemandStyle}/>
        <button onClick={handleSubmit} style={{ backgroundColor: '#27ae60'}}>Send</button>
      </OverviewDropdown>
    </>
  );
};

export default OverviewButtons;
