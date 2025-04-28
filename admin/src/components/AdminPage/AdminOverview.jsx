import React from "react";
import axios from "axios";
import useGetAdmins from "../../hooks/useGetAdmins";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminOverview = () => {
    const { admins, setAdmins, loading } = useGetAdmins();
    const [newAdmin, setNewAdmin] = React.useState({ name: "", email: "" });
    const [showForm, setShowForm] = React.useState(false);
    const [editAdmin, setEditAdmin] = React.useState(null);

    const handleDelete = async (userName) => {
        try {
            const response = await axios.post("/api/admin/deleteadmin", { userName });
            setAdmins(admins.filter(admin => admin.userName !== userName));
            toast.success(response.data.message || "Admin deleted successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete admin.");
        }
    };

    const handleCreateAdmin = async () => {
        const { firstName, lastName, userName, email, password, gender, adminType, birthDate } = newAdmin;
    
        if (![firstName, lastName, userName, email, password, gender, adminType, birthDate].every(Boolean)) {
            alert("All fields are required.");
            return;
        }
    
        try {
            const { data } = await axios.post("/api/admin/createadmin", newAdmin);
            setAdmins([...admins, data]); // Add the new admin to the list
            setNewAdmin({ firstName: "", lastName: "", userName: "", email: "", password: "", gender: "", adminType: "", birthDate: "" });
            toast.success("Admin Created Successfully !!")
            setShowForm(false);
        } catch (error) {
            console.error("Error creating admin:", error);
            toast.error(error.response?.data?.message || "Failed to create admin.");
        }
    };

    //if (loading) return <>loading...</>

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <button onClick={() => setShowForm(true)} style={{ padding: '10px 20px', background: '#27ae60', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>+ Create New Admin</button>
            
            {showForm && (
                <div onClick={() => setShowForm(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div 
                        onClick={(e) => e.stopPropagation()} 
                        style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '350px', textAlign: 'center' }}
                    >
                        <h2>Create New Admin</h2>
                        <input 
                            type="text" 
                            placeholder="First Name" 
                            value={newAdmin.firstName} 
                            onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })} 
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }} 
                        />
                        <input 
                            type="text" 
                            placeholder="Last Name" 
                            value={newAdmin.lastName} 
                            onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })} 
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }} 
                        />
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={newAdmin.userName} 
                            onChange={(e) => setNewAdmin({ ...newAdmin, userName: e.target.value })} 
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }} 
                        />
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={newAdmin.email} 
                            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} 
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }} 
                        />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={newAdmin.password} 
                            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} 
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }} 
                        />
                        <select 
                            value={newAdmin.gender} 
                            onChange={(e) => setNewAdmin({ ...newAdmin, gender: e.target.value })} 
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        <select 
                            value={newAdmin.adminType} 
                            onChange={(e) => setNewAdmin({ ...newAdmin, adminType: e.target.value })} 
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                        >
                            <option value="">Select Admin Type</option>
                            <option value="System Administrator">System Administrator</option>
                            <option value="Operations Manager">Operations Manager</option>
                            <option value="Auditor">Auditor</option>
                        </select>
                        <input 
                            type="date" 
                            placeholder="Birth Date" 
                            value={newAdmin.birthDate} 
                            onChange={(e) => setNewAdmin({ ...newAdmin, birthDate: e.target.value })} 
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }} 
                        />
                        <button 
                            onClick={handleCreateAdmin} 
                            style={{ width: '100%', padding: '10px', background: '#27ae60', color: '#fff', border: 'none', cursor: 'pointer' }}
                        >
                            Add Admin
                        </button>
                    </div>       
                </div>
            )}

            <div style={{ marginTop: '20px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                <h2>Manage Admins</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {admins.map(admin => (
                        <li key={admin.userName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}>
                            <span>{admin.userName} ({admin.adminType})</span>
                            <div>
                                <button onClick={() => setEditAdmin(admin)} style={{ background: '#f39c12', color: '#fff', border: 'none', padding: '5px 10px', marginRight: '5px', cursor: 'pointer' }}>Manage</button>
                                <button onClick={() => handleDelete(admin.userName)} style={{ background: 'red', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {editAdmin && (
                <div
                    onClick={() => setEditAdmin(null)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: "#fff",
                            padding: "20px",
                            borderRadius: "8px",
                            width: "300px",
                            textAlign: "center"
                        }}
                    >
                        <h2>Manage Admin Permissions</h2>

                        <select
                            value={editAdmin.adminType}
                            onChange={(e) => setEditAdmin({ ...editAdmin, adminType: e.target.value })}
                            disabled={!editAdmin.isEditable}
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginBottom: "10px",
                                borderRadius: "4px",
                                border: "1px solid #ddd",
                                background: editAdmin.isEditable ? "#fff" : "#f0f0f0"
                            }}
                        >
                            <option value="System Administrator">System Administrator</option>
                            <option value="Operations Manager">Operations Manager</option>
                            <option value="Auditor">Auditor</option>
                        </select>

                        <button
                            onClick={async () => {
                                if (editAdmin.isEditable) {
                                    try {
                                        await axios.post("/api/admin/managepermissions", {
                                            userName: editAdmin.userName,
                                            adminType: editAdmin.adminType
                                        });
                                        toast.success("Admin permissions updated successfully!");
                                    } catch (error) {
                                        toast.error("Failed to update admin permissions.");
                                        console.error("Error updating admin permissions:", error);
                                    }
                                }
                                setEditAdmin({ ...editAdmin, isEditable: !editAdmin.isEditable });
                            }}
                            style={{
                                width: "100%",
                                padding: "10px",
                                background: editAdmin.isEditable ? "#27ae60" : "#f39c12",
                                color: "#fff",
                                border: "none",
                                cursor: "pointer",
                                marginBottom: "10px"
                            }}
                        >
                            {editAdmin.isEditable ? "Save" : "Update"}
                        </button>
                        
                        <button
                            onClick={() => setEditAdmin(null)}
                            style={{
                                width: "100%",
                                padding: "10px",
                                background: "#e74c3c",
                                color: "#fff",
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}          

            <ToastContainer />
        </div>
    );
};

export default AdminOverview;
