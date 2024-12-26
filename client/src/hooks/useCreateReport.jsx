import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useCreateReport = () => {
    const [reportMessage, setReportMessage] = useState('');
    const [selectedReportType, setSelectedReportType] = useState('');

    const handleSubmit = async () => {
        try {
            const response = await axios.post('/api/requests/createreport', { reportMessage, reportType: selectedReportType });
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setInputAmount(0);
        }
    };

    return { reportMessage, setReportMessage, selectedReportType, setSelectedReportType, handleSubmit };
};

export default useCreateReport;
