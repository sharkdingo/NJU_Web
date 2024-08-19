import React from 'react';
import './LoginPage.scss';
import Login from './components/login.jsx';


const LoginPage = () => {

    return (
        <div className="app-container">
            <header className="navbar">
                <div className="navbar-brand">Sharkdingo/ Login</div>
            </header>

            <main className="main-content">
                <Login />
            </main>

            <footer className="footer">
                <p>&copy; 2024 Sharkdingo. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LoginPage;
