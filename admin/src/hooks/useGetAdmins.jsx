import { useState, useEffect } from "react";
import axios from "axios";

const formatDate = (isoDate) => {
    if (!isoDate) return "";
    return new Date(isoDate).toISOString().split("T")[0]; // Extracts YYYY-MM-DD format
};

const useGetAdmins = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await axios.get("/api/admin/getadmins");

                // Format birthDate before setting state
                const formattedAdmins = response.data.map(admin => ({
                    ...admin,
                    birthDate: formatDate(admin.birthDate)
                }));

                setAdmins(formattedAdmins);
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins();
    }, []);

    return { admins, setAdmins, loading };
};

export default useGetAdmins;
