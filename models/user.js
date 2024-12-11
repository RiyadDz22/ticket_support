const { Pool } = require('pg'); // Import PostgreSQL Pool
require('dotenv').config(); // Load environment variables

// Create a connection pool
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Function to insert a new user into the database
const createUser = async (name, email, passwordHash) => {
    const query = `
        INSERT INTO Users (Username, Email, Password)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [name, email, passwordHash];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Function to check if a user already exists by email
const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM Users WHERE Email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

module.exports = { createUser, findUserByEmail };
