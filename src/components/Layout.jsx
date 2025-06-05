import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { FiMenu, FiUser, FiShoppingCart } from "react-icons/fi";
import SideMenu from "./Sidemenu.jsx";
import CartPopup from "./CartPopup.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext";
import Logo from "../images/Logo.png";
import "../styles/Layout.css";

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const buttonRef = useRef(null);
  const { user } = useAuth();
  const { cartItems } = useCart();

 const itemCount = cartItems.length;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const togglePopup = () => {
    setIsPopupOpen((prev) => !prev);
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-left">
          <button className="menu-button" onClick={toggleMenu}>
            <FiMenu size={32} />
          </button>
        </div>

        <div className="navbar-center">
          <Link to="/">
            <img src={Logo} alt="Logo" className="logo" />
          </Link>
        </div>

        <div className="navbar-right">
          <div className="cart-wrapper" ref={buttonRef}>
            <button onClick={togglePopup} className="cart">
              <FiShoppingCart size={32} />
              <span className="cart-count">{itemCount}</span>
            </button>

            {isPopupOpen && (
              <CartPopup onClose={() => setIsPopupOpen(false)} positionRef={buttonRef} />
            )}
          </div>

          <Link to={user ? "/profile" : "/login"} className="profile">
            <FiUser size={32} />
          </Link>
        </div>
      </nav>
      <SideMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </div>
  );
};

export default Layout;
