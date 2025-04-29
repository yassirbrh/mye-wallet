import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LandingPage = () => {
    const navigate = useNavigate();

	const [ formData, setFormData ] = useState({
		userName: '',
		password: ''
	});

    useEffect(() => {
        document.body.style.margin = "0";
        document.body.style.fontFamily = "Arial, sans-serif";
        document.body.style.backgroundColor = "#f4f7fa";
        document.body.style.display = "flex";
        document.body.style.justifyContent = "center";
        document.body.style.alignItems = "center";
        document.body.style.height = "100vh";
    
        return () => {
          // Reset styles when leaving the page
          document.body.removeAttribute("style");
        };
      }, []);

    const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post('/api/admin/login', formData);
			const response = await axios.get('/api/admin/loggedin');
			if (response.data) navigate('/overview');
		} catch (error) {
			console.log(error)
			toast.error(error.response.data.message);
			console.error('Error sending form data:', error.response.data.message);
		}
	};

	return (
		<>
		    <div className="container">
		        {/* Title */}
		        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#333", marginBottom: "10px" }}>
		            Admin Sign In
		        </h1>
		        <p style={{ fontSize: "14px", color: "#666", marginBottom: "30px" }}>
		            Welcome back! Please sign in to continue.
		        </p>
		        {/* Sign-In Form */}
		        <form style={{ display: "flex", flexDirection: "column", gap: "20px" }} onSubmit={handleSubmit}>
		            {/* Email Input */}
		            <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
		                <label htmlFor="email" style={{ fontSize: "14px", color: "#333", fontWeight: "bold" }}>
		                    Username
		                </label>
		                <input
		                    type="text"
		                    id="userName"
                            name='userName'
		                    placeholder="Enter your username"
		                    style={{
		                    	padding: "12px",
		                    	border: "1px solid #ddd",
		                    	borderRadius: "6px",
		                    	fontSize: "14px",
		                    	outline: "none",
		                    	transition: "border-color 0.3s",
		                    }}
                            value={formData.userName}
                            onChange={handleChange}
		                    required
		                />
		            </div>

		            {/* Password Input */}
		            <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
		                <label htmlFor="password" style={{ fontSize: "14px", color: "#333", fontWeight: "bold" }}>
		                    Password
		                </label>
		                <input
		                    type="password"
		                    id="password"
                            name='password'
		                    placeholder="Enter your password"
		                    style={{
		                	    padding: "12px",
		                		border: "1px solid #ddd",
		                		borderRadius: "6px",
		                		fontSize: "14px",
		                		outline: "none",
		                		transition: "border-color 0.3s",
		                    }}
                            value={formData.password}
                            onChange={handleChange}
		                    required
		                />
		            </div>

		            {/* Submit Button */}
		            <button
		                type="submit"
		                style={{
		                	backgroundColor: "#44c1f7",
		                	color: "white",
		                	padding: "12px",
		                	border: "none",
		                	borderRadius: "6px",
		                	fontSize: "16px",
		                	fontWeight: "bold",
		                	cursor: "pointer",
		                	transition: "background-color 0.3s",
		                }}
		            >
		                Sign In
		            </button>
		        </form>

		        {/* Forgot Password Link */}
		        <p style={{ fontSize: "14px", color: "#666", marginTop: "20px" }}>
		            <a href="#" style={{ color: "#44c1f7", textDecoration: "none" }}>
		                Forgot password?
		            </a>
		        </p>
		    </div>
            <ToastContainer />
		</>
	)
};

export default LandingPage;
