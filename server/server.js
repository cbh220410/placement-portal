const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: './.env' }); // Load environment variables

const app = express();

// --- Middleware ---
// Allows our frontend (React) to make requests to this backend server
app.use(cors());
// Allows Express to read JSON data sent in request bodies
app.use(express.json());

// --- Database Connection ---
// Use environment variable for secure connection string
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/placementdb';
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Test Route ---
// You can visit http://localhost:5000/api to see this message
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Placement System API is running successfully!' });
});

// --- Server Startup ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});