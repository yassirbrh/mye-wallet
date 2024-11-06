import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfileDropdown = ({userData}) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Toggle dropdown visibility when the profile picture is clicked
  const handleProfileClick = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  // Close the dropdown if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      {/* Profile Picture */}
      <img
        src={userData.profilePhoto}
        alt="Profile"
        onClick={handleProfileClick}
        style={{ cursor: 'pointer', borderRadius: '50%', width: '40px', height: '40px' }}
      />

      {/* Dropdown Menu */}
      {isDropdownVisible && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: '50px', // Adjust based on your layout
            right: '0',  // Adjust positioning as needed
            backgroundColor: '#fff',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            padding: '10px',
            width: '200px', // Adjust dimensions as needed
            zIndex: 1000,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <img
              src={userData.profilePhoto}
              alt="Profile"
              style={{ borderRadius: '50%', width: '50px', height: '50px', marginRight: '10px' }}
            />
            <div>
              <strong>{userData.userName}</strong>
              <p style={{ fontSize: '12px', color: '#666' }}>View Profile</p>
            </div>
          </div>
          <button
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '5px',
              border: 'none',
              borderRadius: '5px',
              backgroundColor: '#44c1f7',
              color: 'white',
              cursor: 'pointer',
            }}
            onClick={ async (e) => {
              e.preventDefault();
              navigate('/profile')
            }}
          >
            View Profile
          </button>
          <button
            style={{
              width: '100%',
              padding: '10px',
              border: 'none',
              borderRadius: '5px',
              backgroundColor: '#e74c3c',
              color: 'white',
              cursor: 'pointer',
            }}
            onClick={async (e) => {
              e.preventDefault(); // Prevent the default link behavior
              try {
                // Make a GET request to the logout endpoint
                const response = await axios.get('/api/users/logout');
                if (response.status === 200) {
                  // Redirect to the home page if the logout is successful
                  navigate('/');
                } else {
                  console.error('Logout failed:', response.data);
                }
              } catch (error) {
                console.error('An error occurred during logout:', error);
              }
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
