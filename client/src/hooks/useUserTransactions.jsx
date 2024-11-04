import { useState, useEffect } from 'react';
import axios from 'axios';

const useUserTransactions = () => {
    const [userTransactions, setUserTransactions] = useState([]);

    useEffect(() => {
        const fetchUserTransactions = async () => {
            const transactions = await axios.get('/api/users/gettransactions?limit=4');
            const userData = await axios.get('/api/users/getuser');
            const userId = userData.data._id;
            const userTransactions = [];
            for (const transaction of transactions.data) {
                const date = new Date(transaction.doneAt);
                const transactionData = {
                    doneAt: date.toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    }),
                    isDone: transaction.isDone,
                    receiverID: transaction.receiverID,
                    senderID: transaction.senderID,
                    senderMessage: transaction.senderMessage,
                    transactionBalance: transaction.transactionBalance,
                };
                if (transaction.senderID === userId) {
                    const receiver = await axios.post('/api/requests/getusernamebyid', { operatorID: transaction.receiverID });
                    transactionData.operatorUsername = receiver.data.operatorUsername;
                    transactionData.status = 'sent';
                } else if (transaction.receiverID === userId) {
                    const sender = await axios.post('/api/requests/getusernamebyid', { operatorID: transaction.senderID });
                    transactionData.operatorUsername = sender.data.operatorUsername;
                    transactionData.status = 'received';
                }
                userTransactions.push(transactionData);
            }
            setUserTransactions(userTransactions)
        };
        fetchUserTransactions();
    }, []);

    return userTransactions;
};

export default useUserTransactions;