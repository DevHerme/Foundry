import React from 'react';

function DashboardPage({ onLogout }) {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard! Test Commit + Another Test!</h1>
            <button
                onClick={onLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Logout
            </button>
        </div>
    );
}

export default DashboardPage;
