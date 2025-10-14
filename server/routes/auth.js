const express = require('express');
const router = express.Router();
const { hashPassword, verifyPassword, generateToken } = require('../utils/auth');
const { registerValidation, loginValidation } = require('../validators/auth');
const { validationResult } = require('express-validator');

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 60;

// Registro de usuario
router.post('/register', registerValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, role = 'User' } = req.body;

  try {
    const existingUser = await req.db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const passwordHash = await hashPassword(password);

    const userDoc = {
      email,
      password_hash: passwordHash,
      role,
      is_active: true,
      created_at: new Date(),
      failed_attempts: 0
    };

    await req.db.collection('users').insertOne(userDoc);

    const { password_hash, ...userResponse } = userDoc;
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', loginValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await req.db.collection('users').findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check lockout
    if (user.lockout_until) {
      const now = new Date();
      const lockoutUntil = new Date(user.lockout_until);

      if (now < lockoutUntil) {
        const timeRemaining = Math.ceil((lockoutUntil - now) / 1000 / 60);
        const lockoutBolivia = new Date(lockoutUntil.getTime() - (4 * 60 * 60 * 1000));

        return res.status(403).json({
          message: `Account locked due to too many failed attempts. Try again in ${timeRemaining} minutes (unlocks at ${lockoutBolivia.toLocaleTimeString('es-BO')})`
        });
      } else {
        await req.db.collection('users').updateOne(
          { email },
          { $set: { failed_attempts: 0 }, $unset: { lockout_until: '' } }
        );
        user.failed_attempts = 0;
        delete user.lockout_until;
      }
    }

    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      const failedAttempts = (user.failed_attempts || 0) + 1;

      if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
        const lockoutUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);

        await req.db.collection('users').updateOne(
          { email },
          { $set: { failed_attempts: failedAttempts, lockout_until: lockoutUntil } }
        );

        return res.status(403).json({ message: `Account locked due to too many failed attempts. Try again in ${LOCKOUT_MINUTES} minutes.` });
      } else {
        await req.db.collection('users').updateOne(
          { email },
          { $set: { failed_attempts: failedAttempts } }
        );

        const attemptsLeft = MAX_LOGIN_ATTEMPTS - failedAttempts;
        return res.status(401).json({ message: `Invalid credentials. ${attemptsLeft} attempts remaining.` });
      }
    }

    // Successful login - reset attempts
    await req.db.collection('users').updateOne(
      { email },
      { $set: { failed_attempts: 0 }, $unset: { lockout_until: '' } }
    );

    // Generate token
    const token = generateToken({ sub: user.email, role: user.role }, '24h');

    res.json({ access_token: token, token_type: 'bearer' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
