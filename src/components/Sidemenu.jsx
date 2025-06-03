import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/Sidemenu.css";

function Sidemenu({ isOpen, onClose }) {
  const menuRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsActive(true), 10);
    } else {
      setIsActive(false);
      const timer = setTimeout(() => {
        if (!isOpen) {
          setShouldRender(false);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <>
      <div
        className={`sidemenu-overlay ${isActive ? "open" : ""}`}
        onClick={onClose}
      />
      <div className={`sidemenu ${isActive ? "open" : ""}`}>
        <nav className="sidemenu-nav">
          <div ref={menuRef} className="sidemenu-header">
            <button className="menu-close" onClick={onClose}>
              <FiX />
            </button>
        
            {user ? (
              <button className="menu-logout" onClick={handleLogout}>
                Log out
              </button>
            ) : (
              <Link className="menu-login" onClick={onClose} to="/login">
                Log in
              </Link>
            )}
          </div>
          <div className="sidemenu-navigation">
            <ul>
              <li>
                <NavLink to="/menu" onClick={onClose}>
                  Order Now
                </NavLink>
              </li>

              {/* If logged in remove register button */}
              {user ? (
                <></>
              ) : (
                <li>
                  <NavLink to="/register" onClick={onClose}>
                    Register
                  </NavLink>
                </li>
              )}

              <li>
                <NavLink to="/about" onClick={onClose}>
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to="/services" onClick={onClose}>
                  Services
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" onClick={onClose}>
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Sidemenu;
