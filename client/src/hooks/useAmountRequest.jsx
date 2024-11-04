import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useAmountRequest = () => {
    const [inputAmount, setInputAmount] = useState(0);

    const handleInputChange = (event) => {
        setInputAmount(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('/api/requests/requestbalance', { amount: inputAmount });
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setInputAmount(0);
        }
    };

    return { inputAmount, handleInputChange, handleSubmit };
};

export default useAmountRequest;
