import { useState, useEffect } from 'react';
import axios from 'axios';
import defaultProfilePhoto from '../assets/profile-user-icon-isolated.jpg';

const useAdminData = () => {
    const [adminData, setAdminData] = useState({
        _id: '',
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        adminType: '',
        profilePhoto: ''
    });

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const adminResponse = await axios.get('/api/admin/getadmindata');
                const adminDataResponse = adminResponse.data; 
                setAdminData((prevData) => ({
                    ...prevData,
                    ...adminDataResponse,
                }));
            } catch(error) {
                console.error(`Error fetching user data: ${error}`);
            }
        } 
        const fetchAdminPhoto = async () => {
            try {
              const photoResponse = await axios.get('/api/admin/getphoto', { responseType: 'blob' });
              const imageUrl = URL.createObjectURL(photoResponse.data);
              setAdminData((prevData) => ({
                ...prevData,
                profilePhoto: imageUrl,
              }));
            } catch (error) {
              if (error.response?.status !== 404) {
                console.error(`Error fetching profile photo: ${error}`);
              }
              setAdminData((prevData) => ({
                ...prevData,
                profilePhoto: defaultProfilePhoto,
              }));
            }
        };
      
        fetchAdminData();
        fetchAdminPhoto();
    }, []);

    return adminData;
};

export default useAdminData
