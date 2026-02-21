const User = require('../models/User');
const Organization = require('../models/Organization');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new Organization and Owner
exports.registerOrganization = async (req, res) => {
  const { orgName, name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create Organization
    const organization = new Organization({
      name: orgName,
    });
    await organization.save();

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User (Owner)
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'org_admin',
      organization: organization._id,
    });
    await user.save();

    // Update Org with Owner
    organization.owner = user._id;
    await organization.save();

    // Create Token
    const payload = {
      user: {
        id: user._id,
        role: user.role,
        organization: user.organization,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, organization: user.organization } });
      }
    );

  } catch (err) {
    console.error('Error in registerOrganization:', err);
    res.status(500).send('Server Error: ' + err.message);
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user._id,
        role: user.role,
        organization: user.organization,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, organization: user.organization } });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get Current User (Auth Check)
exports.getMe = async (req, res) => {
  try {
    console.log('getMe called for user:', req.user.id);
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
        console.log('User not found in DB');
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error in getMe:', err);
    res.status(500).send('Server Error');
  }
};

// Get All Users in Org
exports.getOrgUsers = async (req, res) => {
  try {
    const users = await User.find({ organization: req.user.organization }).select('name email role');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new User in the Organization
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'Welcome123!', salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'sales_executive',
      organization: req.user.organization,
    });

    await user.save();
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).send('Server Error');
  }
};

// Update User Role
exports.updateUserRole = async (req, res) => {
  const { role } = req.body;
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Ensure the user belongs to the same org
    if (user.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }
    
    user.role = role;
    await user.save();
    
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).send('Server Error');
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Ensure the user belongs to the same org
    if (user.organization.toString() !== req.user.organization.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this user' });
    }
    
    // Prevent deleting yourself
    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({ message: 'You cannot delete yourself' });
    }

    await user.deleteOne();
    res.json({ message: 'User removed successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send('Server Error');
  }
};
