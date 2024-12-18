const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/user.model');
const db = require('../config/db.config');
require('dotenv').config();

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        // Hash the password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create the user
        const newUser = await createUser(username, email, passwordHash);

        // Generate JWT token
        const token = jwt.sign(
            { userid: newUser.userid, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'User created successfully',
            user: { userid: newUser.userid, username: newUser.username, email: newUser.email },
            token,
        });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Login function
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Fetch user from database
        const query = 'SELECT * FROM Users WHERE email = $1';
        const { rows } = await db.query(query, [email]);
        const user = rows[0];

        // Check if user exists
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.userid, email: user.email, role: user.roleid }, // Payload
            process.env.JWT_SECRET,                                   // Secret key
            { expiresIn: '1h' }                                       // Token expiration
        );

        // Send success response with token
        res.status(200).json({
            message: 'Login successful',
            token: token,
        });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

