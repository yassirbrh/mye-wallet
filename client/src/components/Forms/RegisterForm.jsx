import { Link } from "react-router-dom";
import React, {useState} from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterForm = () => {

    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
    };

    const handleSubmit = async (e) => {
		e.preventDefault();
		try {
            if (formData.password !== formData.confPassword)
            {
                throw new Error("Password and its confirmation aren't the same")
            }
			await axios.post('/api/users/register', formData);
			toast.success("Account Created Successfully !!");
		} catch (error) {
            const errorMessage = error.response?.data?.message || error.toString();
			toast.error(errorMessage);
			console.error('Error sending form data:', errorMessage);
		}
	};
    return (
        <>
        <div id="form">
            <div className="main">
                <div className="wrapper">
                    <form onSubmit={handleSubmit}>
                        <h1>Sign Up</h1>
                        <div className="input-box">
                            <input type="text" placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                        </div>
                        <div className="input-box">
                            <input type="text" placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
                        </div>
                        <div className="input-box">
                            <input type="text" placeholder="Username" name="userName" value={formData.userName} onChange={handleChange} required />
                            <i className="bx bxs-user" />
                        </div>
                        <div className="input-box">
                            <input type="email" placeholder="E-mail" name="email" value={formData.email} onChange={handleChange} required />
                            <i className="bx bx-envelope" />
                        </div>
                        <div className="input-box">
                            <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} required />
                            <i className="bx bxs-lock-alt" />
                        </div>
                        <div className="input-box">
                            <input type="password" placeholder="Confirm Password" name="confPassword" value={formData.confPassword} onChange={handleChange} required />
                            <i className="bx bxs-lock-alt" />
                        </div>
                        <div className="input-box">
                            <input type="date" placeholder="Birth Date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
                            <i className="bx bxs-calendar" />
                        </div>
                        <div className="input-box">
                            <input type="radio" id="gender-male" name="gender" value="male" onChange={handleChange} checked={formData.gender === "male"} required />
                            <label htmlFor="gender-male">Male</label>
                            <input type="radio" id="gender-female" name="gender" value="female" onChange={handleChange} checked={formData.gender === "female"} required />
                            <label htmlFor="gender-female">Female</label>
                        </div>
                        <button type="submit" className="btn">
                            Register
                        </button>
                        <div className="register-link">
                            <p> Already have an account? <Link to="/login">Login</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <ToastContainer />
        </>

    )
};

export default RegisterForm;