import { Link } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiUser, FiShoppingCart } from "react-icons/fi";
import SideMenu from "./Sidemenu.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from '../images/Logo.png';
import "../styles/Navbar.css"; 



const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="layout">
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
        {user ? (
          <Link to="/profile" className="profile">
          <FiUser size={32}/>
        </Link>
        ) : (
          <Link to="/login" className="profile">
          <FiUser size={32}/>
        </Link>
        )}
      </div>
      </nav>
      <SideMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </div>
  );
};

export default Layout;