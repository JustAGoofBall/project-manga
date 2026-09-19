/**
 * Admin Controller
 *
 * WHERE THIS SITS IN THE REQUEST FLOW
 *   routes/admin.js  ->  THIS FILE  ->  models/userModel.js  ->  database
 *
 * Every route that reaches this file has already passed through
 * authMiddleware AND adminMiddleware, so `req.user` exists and is an admin.
 *
 * The two guards below ("you cannot demote yourself", "you cannot delete
 * yourself") exist so the last admin cannot accidentally lock everybody out
 * of the admin panel.
 */

const User = require('../models/userModel');
const { validateId } = require('../utils/validate');
const sendError = require('../utils/sendError');

/**
 * List every user.
 * GET /api/admin/users
 */
exports.getAllUsers = async (req, res) => {
  try {
    // User.getAll() never selects password_hash.
    const users = await User.getAll();

    res.json({ success: true, data: users });
  } catch (error) {
    sendError(res, error);
  }
};

/**
 * Grant or revoke admin rights.
 * PUT /api/admin/users/:id/admin     Body: { is_admin: true | false | 1 | 0 }
 */
exports.setAdminStatus = async (req, res) => {
  try {
    const userId = validateId(req.params.id, 'user');
    const { is_admin } = req.body;

    // Accept either a real boolean or the 1/0 the database uses.
    if (typeof is_admin !== 'boolean' && is_admin !== 0 && is_admin !== 1) {
      return res.status(400).json({
        success: false,
        message: 'is_admin must be a boolean or 0/1'
      });
    }

    if (userId === req.user.id && !is_admin) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove your own admin status'
      });
    }

    // SQLite has no boolean type, so admin status is stored as 1 or 0.
    const updatedUser = await User.update(userId, { is_admin: is_admin ? 1 : 0 });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Admin status updated',
      data: updatedUser
    });
  } catch (error) {
    sendError(res, error);
  }
};

/**
 * Delete a user. Their ratings and favorites go with them (ON DELETE CASCADE).
 * DELETE /api/admin/users/:id
 */
exports.deleteUser = async (req, res) => {
  try {
    const userId = validateId(req.params.id, 'user');

    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const deleted = await User.delete(userId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    sendError(res, error);
  }
};
