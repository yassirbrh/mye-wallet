// AuthCheck.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function AuthCheck({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/api/users/loggedin')
      .then((response) => {
        if (response.data === true) {
          // If the user is authenticated, navigate based on the current page
          const authenticatedPages = [
            'OverviewPage',
            'TransactionPage',
            'BeneficiariePage',
            'ReportPage',
            'AmountDemandPage',
            'CreditCardPage',
            'MessagePage',
            'AssistancePage',
            'ProfilePage'
          ];
          if (!authenticatedPages.includes(children.type.name)) {
            navigate('/overview', { replace: true });
          }
        } else {
          // If not authenticated, handle navigation based on the page type
          const homePages = ['LandingPage', 'RegisterPage', 'LoginPage'];
          if (!homePages.includes(children.type.name)) {
            navigate('/', { replace: true });
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching login status:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate, children]);

  if (loading) return null; // Avoid rendering anything while loading

  // If loading is complete, render the children as intended
  return children;
}

export default AuthCheck;
