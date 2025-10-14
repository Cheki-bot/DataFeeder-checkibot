const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin, getCurrentUser } = require('../middleware/auth');

// Protected profile route
router.get('/profile', authenticateToken, getCurrentUser, (req, res) => {
  const user = req.currentUser;
  const { password_hash, ...userSafe } = user;
  res.json({ user: userSafe });
});

// Admin-only: deactivate user
router.patch('/users/:email/deactivate', authenticateToken, requireAdmin, async (req, res) => {
  const { email } = req.params;
  try {
    await req.db.collection('users').updateOne({ email }, { $set: { is_active: false } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Database error' });
  }
});

// Admin-only: activate user
router.patch('/users/:email/activate', authenticateToken, requireAdmin, async (req, res) => {
  const { email } = req.params;
  try {
    await req.db.collection('users').updateOne({ email }, { $set: { is_active: true } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Database error' });
  }
});

// Admin-only: delete user
router.delete('/users/:email', authenticateToken, requireAdmin, async (req, res) => {
  const { email } = req.params;
  try {
    await req.db.collection('users').deleteOne({ email });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Database error' });
  }
});

module.exports = router;
