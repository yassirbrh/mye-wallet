// src/hooks/useUserData.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import defaultProfilePhoto from '../assets/profile-user-icon-isolated.jpg';

const useUserData = () => {
  const [userData, setUserData] = useState({
    _id: '',
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    balance: 0,
    Beneficiaries: [],
    amountInDemands: 0,
    profilePhoto: '',
    userTransactions: []
  });

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get('/api/users/getuser');
        const balanceRequests = await axios.get('/api/requests/getbalancerequests');
        let amountInDemands = 0;
        for (const balanceRequest of balanceRequests.data) {
          if (balanceRequest.state === undefined) {
            amountInDemands += balanceRequest.amount;
          }
        }
        const { _id, firstName, lastName, email, userName, balance, Beneficiaries } = userResponse.data;
        setUserData((prevData) => ({
          ...prevData,
          _id,
          firstName,
          lastName,
          userName,
          email,
          balance,
          Beneficiaries,
          amountInDemands,
        }));
      } catch (error) {
        console.error(`Error fetching user data: ${error}`);
      }
    };

    // Fetch profile photo
    const fetchUserPhoto = async () => {
      try {
        const photoResponse = await axios.get('/api/users/getphoto', { responseType: 'blob' });
        const imageUrl = URL.createObjectURL(photoResponse.data);
        setUserData((prevData) => ({
          ...prevData,
          profilePhoto: imageUrl,
        }));
      } catch (error) {
        setUserData((prevData) => ({
          ...prevData,
          profilePhoto: defaultProfilePhoto,
        }));
      }
    };

    fetchUserData();
    fetchUserPhoto();
  }, []);

  return userData;
};

export default useUserData;
