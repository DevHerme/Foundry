// Import the required modules
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');


// Create an instance of the Express application
const app = express();

// Middleware
app.use(morgan('dev')); // Log requests to the console
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// API routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the API!' });
});

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
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server AFTER ensuring PORT is set
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
