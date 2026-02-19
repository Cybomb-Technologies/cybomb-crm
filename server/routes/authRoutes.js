const express = require('express');
const router = express.Router();
const { registerOrganization, login, getMe, getOrgUsers } = require('../controllers/authController');
const { auth } = require('../middleware/authMiddleware');

// @route   POST api/auth/register-org
// @desc    Register a new organization and admin user
// @access  Public
router.post('/register-org', registerOrganization);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, getMe);

// @route   GET api/auth/users
// @desc    Get all users in org
// @access  Private
router.get('/users', auth, getOrgUsers);

module.exports = router;
