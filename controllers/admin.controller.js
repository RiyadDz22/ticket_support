const pool = require('../config/db.config'); // Assuming you are using pool for db connections

// Fetch the dashboard data (e.g., list of users)
exports.getDashboard = async (req, res) => {
    try {
        const query = 'SELECT UserID, username, email, role FROM Users';
        const { rows } = await pool.query(query);

        res.status(200).json({ users: rows });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create a new user (admin only)
exports.createUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const query = 'INSERT INTO Users (username, email, password, role) VALUES ($1, $2, $3, $4)';
        await pool.query(query, [username, email, hashedPassword, role]);

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a user (admin only)
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the user exists before deleting
        const checkQuery = 'SELECT * FROM Users WHERE UserID = $1';
        const { rows } = await pool.query(checkQuery, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the user from the database
        const deleteQuery = 'DELETE FROM Users WHERE UserID = $1';
        await pool.query(deleteQuery, [id]);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
