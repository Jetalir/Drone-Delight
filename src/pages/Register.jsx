import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Register.css";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    return ( 
        <div className="register-container">
            <h2>Register</h2>
            <form className="register-form" >
                <div>
                    <input type="text" placeholder="Name" id="username" name="username" required />
                </div>
                <div>
                    <input type="email" placeholder="Email" id="email" name="email" required />
                </div>
                <div>
                    <input type="password" placeholder="Password" id="password" name="password" required />
                </div>
                <div>
                    <input type="password" placeholder="Confirm Password" id="confirmPassword" name="confirmPassword" required />
                </div>
                <button type="submit" className="registerbtn">Register</button>
            </form>
        </div>
     );
}

export default Register;