import React, { useState } from 'react';
import OverviewDropdown from '../OverviewPage/OverviewDropdown';
import useTransferMoney from '../../hooks/useTransferMoney';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TransactionButton = ({ userData }) => {
  const [isTransactionDropdownOpen, setTransactionDropdownOpen] = useState(false);
  const {
    amount,
    handleTransferChange,
    handleBeneficiaryChange,
    message,
    handleMessageChange,
    handleTransferSubmit,
  } = useTransferMoney();

  const buttonStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#44c1f7',
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
        <button style={buttonStyle} onClick={() => setTransactionDropdownOpen(true)}>
          <i className="bx bx-plus" style={{ fontSize: '16px' }}></i> New Transaction
        </button>
      </div>

      <ToastContainer />

      {/* Transaction Dropdown */}
      <OverviewDropdown isOpen={isTransactionDropdownOpen} onClose={() => setTransactionDropdownOpen(false)}>
        <p>Choose the beneficiary</p>
        <select multiple style={inputStyle} onChange={handleBeneficiaryChange}>
          {userData.Beneficiaries.map((beneficiary, index) => (
            <option key={index} value={beneficiary}>
              {beneficiary}
            </option>
          ))}
        </select>

        <p>Enter the amount you want to send</p>
        <input type="number" value={amount} onChange={handleTransferChange} placeholder="Enter Amount" style={inputStyle} />

        <p>Leave a message here</p>
        <input type="text" value={message} onChange={handleMessageChange} placeholder="Enter Message" style={inputStyle} />

        <button onClick={handleTransferSubmit} style={submitButtonStyle}>
          Send
        </button>
      </OverviewDropdown>
    </>
  );
};

export default TransactionButton;
