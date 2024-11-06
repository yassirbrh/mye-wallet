// Dropdown.js
import React, { useEffect } from 'react';

const OverviewDropdown = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Close the dropdown if clicked outside
      if (event.target.classList.contains('dropdown-overlay')) {
        onClose();
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="dropdown-overlay" style={overlayStyle}>
      <div style={dropdownStyle}>
        {children}
      </div>
    </div>
  );
};

// Styles for dropdown and overlay
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backdropFilter: 'blur(5px)',
  zIndex: 1000,
};

const dropdownStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  minWidth: '300px',
  minHeight: '150px',
};

export default OverviewDropdown;
