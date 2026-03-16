const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const User = require('../models/userModel');

// Get all users (admin only)
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.getAll();
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// Toggle admin status for a user (admin only)
router.put('/users/:id/admin', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { is_admin } = req.body;

    if (typeof is_admin !== 'boolean' && is_admin !== 0 && is_admin !== 1) {
      return res.status(400).json({
        success: false,
        message: 'is_admin must be a boolean or 0/1'
      });
    }

    // Prevent admin from removing their own admin status
    if (userId === req.user.id && !is_admin) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove your own admin status'
      });
    }

    // Update user
    const db = require('../config/db');
    const [result] = await db.query(
      'UPDATE users SET is_admin = ? WHERE id = ?',
      [is_admin ? 1 : 0, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const updatedUser = await User.getById(userId);
    res.json({
      success: true,
      message: 'Admin status updated',
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
});

// Delete a user (admin only)
router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const deleted = await User.delete(userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
});

module.exports = router;
