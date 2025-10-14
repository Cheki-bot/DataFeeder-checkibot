const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '12', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

function decodeToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function generateToken(payload, expiresIn = '24h') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

module.exports = {
  hashPassword,
  verifyPassword,
  decodeToken,
  generateToken
};
