const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
<<<<<<< HEAD


// Create an instance of the Express application
const app = express();

// Middleware
app.use(morgan('dev')); // Log requests to the console
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// API routes
=======
require('dotenv').config();

const app = express();

app.use(morgan('dev')); // Log requests
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// API routes (prioritize these before serving React frontend)
>>>>>>> beta
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the API!' });
});

<<<<<<< HEAD
// Serve the React frontend if build exists
var port = 3000;
const frontendPath = path.join(__dirname, '../frontend/build');
if (require('fs').existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
  port = 9000;  
} else {
  console.log('Frontend build folder not found. Serving API only.');
  console.log('Backend will be hosted on port 3000.');
  port = 3000;  
=======
// Serve the React frontend
const frontendPath = path.join(__dirname, '../frontend/build');
if (process.env.NODE_ENV === 'production' && require('fs').existsSync(frontendPath)) {
  app.use(express.static(frontendPath));

  // Catch-all handler for React routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  console.log('Frontend build folder not found. Serving API only.');
>>>>>>> beta
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

<<<<<<< HEAD
// Start the server AFTER ensuring PORT is set
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
=======
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
>>>>>>> beta
});
