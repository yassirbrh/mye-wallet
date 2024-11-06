import { Link, useNavigate } from 'react-router-dom';
import React, {useState} from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginForm = () => {

	const navigate = useNavigate();

	const [ formData, setFormData ] = useState({
		userName: '',
		password: ''
	});

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post('/api/users/login', formData);
			const response = await axios.get('/api/users/loggedin');
			if (response.data) navigate('/overview');
		} catch (error) {
			console.log(error)
			toast.error(error.response.data.message);
			console.error('Error sending form data:', error.response.data.message);
		}
	};
	return (
		<>
            <div id="form">
                <div className="main" style={{height: "35vh"}}>
		            <div className="wrapper">
		                <form onSubmit={handleSubmit}>
		                    <h1>Login</h1>
		                    <div className="input-box">
		                        <input type="text" placeholder="Username" name="userName" value={formData.userName} onChange={handleChange} required />
		                        <i className="bx bxs-user" />
		                    </div>
		                    <div className="input-box">
		                        <input type="password" placeholder="password" name="password" value={formData.password} onChange={handleChange} required />
		                        <i className="bx bxs-lock-alt" />
		                    </div>
		                    <div className="remember-forgot">
		                        <label>
		                            <input type="checkbox" /> Remember Me
                                </label>
		                        <a href="#">Forgot Password</a>
		                    </div>
		                    <button type="submit" className="btn">Login</button>
		                    <div className="register-link">
		                        <p> Dont have an account? <Link to="/register">Register</Link></p>
		                    </div>
		                </form>
		            </div>
                </div>
            </div>
			<ToastContainer />
		</>
	)
};

export default LoginForm;
