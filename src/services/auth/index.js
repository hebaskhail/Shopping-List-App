const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD_HASH = process.env.USER_PASSWORD_HASH;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const login = async (email, password) => {
  if (email !== USER_EMAIL) {
    return { success: false, message: 'Invalid email or password' };
  }

  const isMatch = await bcrypt.compare(password, USER_PASSWORD_HASH);

  if (!isMatch) {
    return { success: false, message: 'Invalid email or password' };
  }

  const token = jwt.sign({ email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { success: true, token };
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = {
  login,
  verifyToken,
};
