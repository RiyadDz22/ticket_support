// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { Client } = require('pg'); // Import the PostgreSQL client
require('dotenv').config();

// Middleware
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Load environment variables from .env file

// Configure the PostgreSQL client using .env values
const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Test the database connection
(async () => {
    try {
        await client.connect(); // Connect to the database
        console.log('Connected to the database successfully!');
    } catch (error) {
        console.error('Failed to connect to the database:', error.message);
    } finally {
        await client.end(); // Ensure the connection is closed
    }
})();
