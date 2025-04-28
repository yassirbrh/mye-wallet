import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const Sidebar = ({ adminData, activeItem }) => {
  // Function to determine if a nav item should be active
  const isActive = (item) => item === activeItem ? 'nav-item active' : 'nav-item';
  const [cookies, setCookie] = useCookies(['userData']);

  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault(); // Prevent the default link behavior
    try {
      // Make a GET request to the logout endpoint
      const response = await axios.get('/api/admin/logout');
      if (response.status === 200) {
        // Redirect to the home page if the logout is successful
        navigate('/');
      } else {
        console.error('Logout failed:', response.data);
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };

  return (
    <div className="sidebar">
      <div className="logo">MyEWalletAdmin</div>
      <Link to="/overview" className={isActive('Overview')}>
        <i className='bx bx-home'></i> Overview
      </Link>
      {adminData.adminType === "System Administrator" && (
        <Link to="/manage-admins" className={isActive("Admins")}>
          <i className="bx bx-user-plus"></i> Admins
        </Link>
      )}
      <Link to="/users" className={isActive('Users')}>
        <i className='bx bx-user'></i> Users
      </Link>
      <Link to="/amount-demands" className={isActive('Amount Demands')}>
        <i className='bx bx-money'></i> Amount Demands
      </Link>
      <Link to="/reports" className={isActive('Reports')}>
        <i className='bx bx-line-chart'></i> Reports
      </Link>
      <Link to="/credit-cards" className={isActive('Credit Cards')}>
        <i className='bx bx-credit-card'></i> Credit Cards
      </Link>
      <Link to="/assistance" className={isActive('Assistance')}>
        <i className='bx bx-support'></i> Assistance
      </Link>
      <div onClick={handleLogout} className={'nav-item logout'}>
        <i className="bx bxs-log-out-circle"></i> Logout
      </div>
    </div>
  );
};

export default Sidebar;
