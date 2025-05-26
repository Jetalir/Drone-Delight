import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiUser, FiShoppingCart } from "react-icons/fi";
import Footer from "./Footer.jsx";
import SideMenu from "./Sidemenu.jsx";
import Logo from '../assets/Logo.png';
import "../styles/Navbar.css"; 



const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <Link to="/profile" className="profile">
          <FiUser size={32}/>
        </Link>
      </div>
      </nav>
      <SideMenu isOpen={isMenuOpen} onClose={closeMenu} />
      <main>
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
};

export default Layout;