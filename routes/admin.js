/**
 * Admin routes - /api/admin/...
 *
 * Every route here runs two guards, in this order:
 *   authMiddleware  - is there a valid token? (401 if not)
 *   adminMiddleware - is that user an admin?  (403 if not)
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Applies both guards to every route defined in this file,
// so they do not have to be repeated on each line below.
router.use(authMiddleware, adminMiddleware);

// GET /api/admin/users - list all users
router.get('/users', adminController.getAllUsers);

// PUT /api/admin/users/:id/admin - grant or revoke admin rights
router.put('/users/:id/admin', adminController.setAdminStatus);

// DELETE /api/admin/users/:id - delete a user
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
