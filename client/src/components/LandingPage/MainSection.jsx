import { useNavigate } from 'react-router-dom';

const SignupButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/register');
  };

  return (
    <button onClick={handleClick}>Sign Up</button>
  );
};

function Main() {
	return (
		<>
		    <div className='main'>
		        <div className="hero">
		            <div className="hero-content">
		                <h1 className="text">MyEWallet</h1>
		                <p className="text">Your digital wallet for easy payments and transactions.</p>
		            </div>
		        </div>
		        <div className="features">
		            <div className="features-content">
		                <h2 className="text">Features</h2>
		                <ul>
		                    <li className="text">Mobile payments</li>
		                    <li className="text">Bill payments</li>
		                    <li className="text">Money transfers</li>
		                    <li className="text">Gift cards</li>
		                    <li className="text">Rewards and offers</li>
		                </ul>
		            </div>
		        </div>
		        <div className="get-started">
		            <div className="get-started-content">
		                <h2 className="text">Get Started Today</h2>
		                <SignupButton />
		            </div>
		        </div>
		    </div>
		</>
	)
}


export default Main;
