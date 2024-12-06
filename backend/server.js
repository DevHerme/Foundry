const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(morgan('dev')); // Log requests
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// API routes (prioritize these before serving React frontend)
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the API!' });
});

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
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
