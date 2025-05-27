import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import '../styles/Sidemenu.css'; 

function Sidemenu( {isOpen, onClose }) {
    const menuRef = useRef(null);
    const [shouldRender, setShouldRender] = useState(false);
    const [isActive, setIsActive] = useState(false);

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
        <div className={`sidemenu-overlay ${isActive ? 'open' : ''}`} onClick={onClose}/>
        <div className={`sidemenu ${isActive ? 'open' : ''}`} >
            <nav>
                <div ref={menuRef} className='sidemenu-header'>
                    <button className='menu-close' onClick={onClose}><FiX /></button>
                    <a className='menu-login' href='/login'>Log in</a>
                </div>
                <div className='sidemenu-navigation'>
                    <ul>
                        <li><NavLink to="/menu" onClick={onClose}>Order Now</NavLink></li>
                        <li><NavLink to="/register" onClick={onClose}>Register</NavLink></li>
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