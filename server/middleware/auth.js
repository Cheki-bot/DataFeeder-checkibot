const { decodeToken } = require('../utils/auth');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const payload = decodeToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

async function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

async function getCurrentUser(req, res, next) {
  try {
    const user = await req.db.collection('users').findOne({ email: req.user.sub });
    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }
    req.currentUser = user;
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Database error' });
  }
}

module.exports = {
  authenticateToken,
  requireAdmin,
  getCurrentUser
};

function requireRole(role) {
  return (req, res, next) => {
    if (!req.currentUser) {
      return res.status(401).json({ message: 'User not loaded' });
    }
    if (req.currentUser.role !== role) {
      return res.status(403).json({ message: `${role} role required` });
    }
    next();
  };
}

module.exports.requireRole = requireRole;
