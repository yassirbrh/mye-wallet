import { Link } from 'react-router-dom';
function Header() {
    return (
        <>
            <div className="header">
                <Link to="/" className="logo">MyEWallet</Link>
                <input type="checkbox" id="check" />
                <label htmlFor="check" className="icons">
                    <i className="bx bx-menu" id="menu-icon" />
                    <i className="bx bx-x" id="close-icon" />
                </label>
                <nav className='navbar'>
                    <Link to="/" style={{ "--i": 0 }}>Home</Link>
                    <Link to="/about" style={{ "--i": 1 }}>About</Link>
                    <Link to="/gallery" style={{ "--i": 2 }}>Gallery</Link>
                    <Link to="/register" style={{ "--i": 3 }}>Sign Up</Link>
                    <Link to="/login" style={{ "--i": 4 }}>Login</Link>
                </nav>
            </div>
        </>
    )
}

export default Header;