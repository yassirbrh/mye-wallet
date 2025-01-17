import { useState } from 'react';
import axios from 'axios';

const useSendMessage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (receiverUsername, content) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/requests/sendmessage', {
        receiverUsername,
        content,
      });

      return response.data; // Return response data for further processing if needed
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while sending the message.');
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage, isLoading, error };
};

export default useSendMessage;
