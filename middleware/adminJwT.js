const jwt = require('jsonwebtoken');

module.exports = {
    isAdmin: (req, res, next) => {
        const token = req.header('x-auth-token'); // Token sent in the request header

        if (!token) {
            return res.status(403).json({ message: 'No token provided' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Store user information from the token

            if (req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Access denied. Admins only.' });
            }

            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    },
};
