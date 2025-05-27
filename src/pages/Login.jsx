import React, { Component } from 'react';
import "../styles/Login.css";

function Login() {
    return ( 
        <div className="login-container">
            <h2>Login</h2>
            <form className="login-form">
                <div>
                    <input type="text" placeholder='Name' id="username" name="username" required />
                </div>
                <div>
                    <input type="password" placeholder='Password' id="password" name="password" required />
                </div>
                <button type="submit" className="loginbtn">Login</button>
            </form>
        </div>
    );
}

export default Login;