const express = require('express');
// ... other imports
const authRoutes = require('./routes/auth.routes'); // <-- NEW IMPORT

const app = express();
// ... (middleware and db connection remain the same)

// --- API Routes ---
app.use('/api/auth', authRoutes); // <-- NEW: Connect the auth routes to the API

// --- Server Startup ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});