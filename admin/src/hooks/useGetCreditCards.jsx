
import { useState, useEffect } from "react";
import axios from "axios";

const useGetCreditCards = () => {
  const [creditCards, setCreditCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCreditCards = async () => {
      try {
        const response = await axios.get("/api/admin/getcreditcards");
        const formattedCards = response.data.map((card) => ({
          ...card,
          cardNumber: card.cardNumber.toString(), // Convert number to string
          expDate: new Date(card.expDate).toLocaleDateString("en-US", {
            month: "2-digit",
            year: "2-digit",
          }), // Format date to MM/YY
        }));
        setCreditCards(formattedCards);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCreditCards();
  }, []);

  return { creditCards, loading, error };
};

export default useGetCreditCards;
