import axios from "axios";
import { useState, useEffect } from "react";

const useOverviewCards = () => {
    const [data, setData] = useState({
        requests: {},
        reports: {},
        assistances: {},
        creditcards: {},
        amountdemands: {}
    });
    const [loading, setLoading] = useState(true);

    const addItem = (category, key, value) => {
        setData((prevData) => ({
            ...prevData,
            [category]: { ...prevData[category], [key]: value }
        }));
    };
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await Promise.all([
                    axios.get('/api/admin/requests'),
                    axios.get('/api/admin/reports'),
                    axios.get('/api/admin/getassistancerequests'),
                    axios.get('/api/admin/getcreditcards'),
                    axios.get('/api/admin/getamountdemands')
                ]);
                const [requests, reports, assistances, creditcards, amountdemands] = response.map(res => res.data);
                let index = 1;
                for (const request of requests) {
                    addItem("requests", `Request ${index}`, `${request.userName} (${request.firstName} ${request.lastName})`);
                    index++;
                    if (index === 4) break;
                }
                index = 1;
                for (const report of reports) {
                    if (report.state !== 'unchecked') continue;
                    addItem("reports", `Report ${index}`, `from ${report.userID.userName} (${report.userID.firstName} ${report.userID.lastName})`);
                    index++;
                    if (index === 4) break;
                }
                index = 1;
                for (const assistance of assistances) {
                    addItem("assistances", `Request ${index}`, `from ${assistance.userID.userName} (${assistance.userID.firstName} ${assistance.userID.lastName})`);
                    index++;
                    if (index === 4) break;
                }
                index = 1;
                for (const amountdemand of amountdemands) {
                    if (amountdemand.state !== undefined) continue;
                    addItem("amountdemands", `Demand ${index}`, `from ${amountdemand.userID.userName} (${amountdemand.userID.firstName} ${amountdemand.userID.lastName})`);
                    index++;
                    if (index === 4) break;
                }
                index = 1;
                for (const creditcard of creditcards) {
                    addItem("creditcards", `Request ${index}`, `from ${creditcard.userID.userName} (${creditcard.userID.firstName} ${creditcard.userID.lastName})`);
                    index++;
                    if (index === 4) break;
                }
            } finally {
                setLoading(false)
            }
        }
        fetchRequests();
    }, []);
    return { data, loading };
};

export default useOverviewCards;