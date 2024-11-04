import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useTransferMoney = () => {
    const [amount, setAmount] = useState(0);
    const [beneficiary, setBeneficiary] = useState([]);
    const [message, setMessage] = useState("");
  
    const handleTransferChange = (event) => {
      setAmount(event.target.value); // Ensure amount is a number
    };
  
    const handleBeneficiaryChange = (e) => {
      const selectedOption = Array.from(e.target.selectedOptions).map(option => option.value);
      setBeneficiary(selectedOption);
    };
  
    const handleMessageChange = (e) => {
      setMessage(e.target.value);
    };
  
    const handleTransferSubmit = async () => {
      try {
        const response = await axios.post('/api/users/transfer', { receiverUsername: beneficiary, balance: Number(amount), message });
        toast.success(response.data.message);
        
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
        console.log(beneficiary)
      } finally {
        setAmount(0); 
        setBeneficiary([]);
        setMessage("");
      }
    };
  
    return { 
      amount, 
      message, 
      beneficiary,
      handleMessageChange, 
      handleTransferChange, 
      handleBeneficiaryChange, 
      handleTransferSubmit 
    };
  };
  
  export default useTransferMoney;
