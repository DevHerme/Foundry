// Import the required modules
const express = require('express');
const morgan = require('morgan'); // Optional: For logging requests
const cors = require('cors'); // Optional: For enabling CORS
require('dotenv').config();
const express = require('express');
// Create an instance of the Express application
const app = express();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Middleware
app.use(morgan('dev')); // Log requests to the console
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Basic route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Example of another route
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the API!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Set the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});