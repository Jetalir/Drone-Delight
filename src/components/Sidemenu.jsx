import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import '../styles/Sidemenu.css'; 
function Sidemenu( {isOpen, onClose }) {
    const menuRef = useRef(null);

    const handleOverlayClick = (e) => {
        if (e.target === menuRef.current) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return ( 
        <>
        {isOpen && <div className="sidemenu-overlay" onClick={onClose} />}
        <div className="sidemenu">
            <nav>
                <div ref={menuRef} className='sidemenu-header'>
                    <button onClick={onClose}><FiX size={28}/></button>

                    <a href='/login'>Login</a>
                </div>
                <div className='sidemenu-navigation'>
                    <ul>
                        <li><NavLink to="/menu" onClick={onClose}>Order Now</NavLink></li>
                        <li><NavLink to="/about" onClick={onClose}>About</NavLink></li>
                        <li><NavLink to="/services" onClick={onClose}>Services</NavLink></li>
                        <li><NavLink to="/contact" onClick={onClose}>Contact</NavLink></li>
                    </ul>
                </div>
            </nav>
        </div>
        </>
    );
}

export default Sidemenu;