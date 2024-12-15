const express = require('express');
const app = express();
const pool = require('./config/db.config');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const cors = require('cors');

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/auth', authRoutes); // Routes for user authentication (login/signup)
app.use('/admin', adminRoutes); // Admin routes (protected)

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

