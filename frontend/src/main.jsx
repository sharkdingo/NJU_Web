import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App.jsx'
import './index.css'
import LoginPage from "./LoginPage.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <Router>
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/:username" element={<App />} />
        </Routes>
    </Router>
)
