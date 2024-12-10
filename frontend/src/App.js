import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';

function App() {
    // Retrieve token from localStorage on app load
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const handleLogin = (newToken) => {
        localStorage.setItem('token', newToken); // Save token
        setToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token
        setToken(null);
    };

    // PrivateRoute to protect pages
    const PrivateRoute = ({ children }) => {
        return token ? children : <Navigate to="/login" />;
    };

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Protected Route */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <DashboardPage onLogout={handleLogout} />
                        </PrivateRoute>
                    }
                />

                {/* Fallback Route */}
                <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
            </Routes>
        </Router>
    );
}

export default App;
