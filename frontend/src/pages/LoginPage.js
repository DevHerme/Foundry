import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import useBaseUrl from '../hooks/useBaseUrl'; // Adjust the path if needed

function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State for error message

    const baseUrl = useBaseUrl();
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear previous errors
    
        try {
            const response = await fetch(baseUrl+'/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'testing' : 'test' },
                body: JSON.stringify({ email, password }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.error || 'Invalid email or password.');
            }
    
            console.log('Login successful:', data.message);
    
            // Save token and trigger App state update
            localStorage.setItem('token', data.token);
            onLogin(data.token);
            navigate('/dashboard'); // Redirect to dashboard
        } catch (error) {
            console.error('Login error:', error.message);
            setErrorMessage(error.message);
        }
    };
    
    

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-80">
                <h2 className="text-2xl font-bold mb-4 text-gray-700 text-center">Login Test 2</h2>

                {/* Error Message */}
                {errorMessage && (
                    <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
                )}

                {/* Email Input */}
                <div className="mb-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Password Input */}
                <div className="mb-4">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                    Login
                </button>

                {/* Sign Up Link */}
                <p className="mt-4 text-center text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-500 hover:underline">
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;
