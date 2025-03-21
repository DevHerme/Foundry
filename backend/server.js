const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes'); // Import your routes
require('dotenv').config();

const app = express();

// Import your webhook routes
const webhookRoutes = require('./routes/webhookRoutes'); 

// Middleware
app.use(morgan('dev'));
app.use(cors({
    origin: "http://localhost:3000",  // Allow frontend to call backend
    credentials: true
}));
app.use(express.json());

// Register API routes
app.use('/api', authRoutes);

// Mount your webhook routes
app.use('/webhook', webhookRoutes); 

// Serve React frontend if build exists
const frontendPath = path.join(__dirname, '../frontend/build');
if (require('fs').existsSync(frontendPath)) {
    app.use(express.static(frontendPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
});
