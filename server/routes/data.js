const express = require('express');
const router = express.Router();
const { authenticateToken, getCurrentUser, requireRole } = require('../middleware/auth');

router.post('/data', authenticateToken, getCurrentUser, requireRole('User'), async (req, res) => {
  const payload = req.body;
  try {
    const result = await req.db.collection('data').insertOne({ payload, created_by: req.currentUser.email, created_at: new Date() });
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

module.exports = router;
