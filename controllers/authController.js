const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { validateRegister, validateLogin } = require('../validators/authValidator');

// JWT Secret - In productie gebruik je een environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

/**
 * Register a new user
 * @route POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    // Validate input
    const { username, email, password } = validateRegister(req.body);

    // Check if user already exists (by email)
    const existingUserByEmail = await User.getByEmail(email);
    if (existingUserByEmail) {
      return res.status(409).json({
        success: false,
        message: 'Email already in use'
      });
    }

    // Check if username already exists
    const existingUserByUsername = await User.getByUsername(username);
    if (existingUserByUsername) {
      return res.status(409).json({
        success: false,
        message: 'Username already taken'
      });
    }

    // Create new user
    const user = await User.create(username, email, password);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          created_at: user.created_at
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    // Validate input
    const { email, password } = validateLogin(req.body);

    // Find user by email
    const user = await User.getByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await User.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 * @access Protected
 */
exports.getProfile = async (req, res, next) => {
  try {
    // User is already attached to req by auth middleware
    const user = await User.getById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update current user profile
 * @route PUT /api/auth/me
 * @access Protected
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const updates = {};

    if (username) updates.username = username;
    if (email) updates.email = email;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    // Check if username is taken by another user
    if (username) {
      const existingUser = await User.getByUsername(username);
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(409).json({
          success: false,
          message: 'Username already taken'
        });
      }
    }

    // Check if email is taken by another user
    if (email) {
      const existingUser = await User.getByEmail(email);
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(409).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    const updatedUser = await User.update(req.user.id, updates);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete current user account
 * @route DELETE /api/auth/me
 * @access Protected
 */
exports.deleteAccount = async (req, res, next) => {
  try {
    const deleted = await User.delete(req.user.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
