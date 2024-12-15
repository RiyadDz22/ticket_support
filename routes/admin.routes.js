const express = require('express');
const router = express.Router();
const adminJwt = require('../middleware/adminJwT');
const adminController = require('../controllers/admin.controller');

// Admin Dashboard (protected route)
router.get('/dashboard', adminJwt.isAdmin, adminController.getDashboard);

// Create a new user (admin only)
router.post('/create-user', adminJwt.isAdmin, adminController.createUser);

// Delete a user (admin only)
router.delete('/delete-user/:id', adminJwt.isAdmin, adminController.deleteUser);

module.exports = router;
