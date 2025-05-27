import { Link } from "react-router-dom";
import { FiMenu, FiUser, FiShoppingCart } from "react-icons/fi";
import "../styles/Navbar.css"; 
import Logo from '../images/Logo.png';

function Navbar({ toggleMenu }) {  // Receive toggleMenu as prop
  return (
    <nav className="navbar">
      <button className="menu-button" onClick={toggleMenu}>
        <FiMenu size={32}/>
      </button>
      
      <Link to="/">
        <img src={Logo} alt="Logo" className="logo" />
      </Link>
      
      <div className="navbar-right">
        <div>
          <Link to="/cart" className="cart">
            <FiShoppingCart size={32}/> 
            <span className="cart-count">0</span>
          </Link>
        </div>
        <Link to="/profile" className="profile">
          <FiUser size={32}/>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;