const express = require('express');
const router = express.Router();
const { registerOrganization, login, getMe, getOrgUsers, createUser, updateUserRole, deleteUser } = require('../controllers/authController');
const { auth, authorize } = require('../middleware/authMiddleware');

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
router.get('/users', auth, authorize('org_admin', 'sales_manager'), getOrgUsers);

// @route   POST api/auth/users
// @desc    Create a new user in the organization
// @access  Private (Org Admin only)
router.post('/users', auth, authorize('org_admin'), createUser);

// @route   PUT api/auth/users/:id/role
// @desc    Update a user's role
// @access  Private (Org Admin only)
router.put('/users/:id/role', auth, authorize('org_admin'), updateUserRole);

// @route   DELETE api/auth/users/:id
// @desc    Remove a user from the organization
// @access  Private (Org Admin only)
router.delete('/users/:id', auth, authorize('org_admin'), deleteUser);

module.exports = router;
