import { useState, useEffect } from "react";
import axios from "axios";

const useDashboardStats = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/api/admin/getdashboardstats", { withCredentials: true});
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  return { data, loading, error };
};

export default useDashboardStats;