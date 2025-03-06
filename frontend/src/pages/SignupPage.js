import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useBaseUrl from '../hooks/useBaseUrl'; // Adjust the path if needed

function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]); // Array of errors

    const baseUrl = useBaseUrl();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]); // Clear previous errors

        try {
            const response = await fetch(baseUrl + '/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    setErrors(data.errors); // Set errors from the backend
                } else {
                    throw new Error(data.message || 'Signup failed');
                }
                return;
            }

            alert('Signup successful! You can now log in.');
            navigate('/login');
        } catch (error) {
            console.error('Signup error:', error.message);
            setErrors([{ msg: error.message }]); // Handle unexpected errors
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-80">
                <h2 className="text-2xl font-bold mb-4 text-gray-700 text-center">Sign Up</h2>

                {/* Display Errors */}
                {errors.length > 0 && (
                    <div className="mb-4">
                        {errors.map((error, index) => (
                            <p key={index} className="text-red-500 text-sm text-center">
                                {error.msg}
                            </p>
                        ))}
                    </div>
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
                    Sign Up
                </button>
            </form>
        </div>
    );
}

export default SignupPage;
