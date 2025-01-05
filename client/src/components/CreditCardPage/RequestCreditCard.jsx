import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RequestCreditCard = () => {
  const [cardType, setCardType] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    if (!cardType) {
      toast.error('Please select a card type.');
      return;
    }

    try {
      const response = await axios.post('/api/requests/requestcreditcard', { cardType });
      toast.success('Credit card request submitted successfully!');
      setCardType(''); // Reset the selected card type
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit credit card request.');
    }
  };

  return (
    <div style={sectionStyle}>
      <h3 style={titleStyle}>Request a New Credit Card</h3>
      <form onSubmit={handleSubmit} style={formStyle}>
        <select
          style={selectStyle}
          value={cardType}
          onChange={(e) => setCardType(e.target.value)}
        >
          <option value="" disabled>
            Select Card Type
          </option>
          <option value="visa">Visa</option>
          <option value="mastercard">MasterCard</option>
          <option value="amex">American Express</option>
          <option value="discover">Discover</option>
        </select>
        <button type="submit" style={buttonStyle}>
          Request Card
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

// Inline styles
const sectionStyle = {
  width: '50%',
  textAlign: 'center',
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
};

const titleStyle = {
  marginBottom: '20px',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const selectStyle = {
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  width: '100%',
};

const buttonStyle = {
  padding: '10px',
  border: 'none',
  borderRadius: '5px',
  backgroundColor: '#44c1f7',
  color: 'white',
  cursor: 'pointer',
};

export default RequestCreditCard;
