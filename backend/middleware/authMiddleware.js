const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ─── AUTH MIDDLEWARE ──────────────────────────────────────────────────────────
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token)
    return res.status(401).json({ message: 'No token, access denied.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id).select('-password');

    if (!user)
      return res.status(401).json({ message: 'User not found.' });

    // Every API call checks soft-delete — invalidates token for deleted users
    if (user.isDeleted) {
      return res.status(403).json({
        message: 'Your account has been deleted by admin.',
        code: 'ACCOUNT_DELETED',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// ─── ADMIN MIDDLEWARE ─────────────────────────────────────────────────────────
const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ message: 'Admin access required.' });
  next();
};

module.exports = { authMiddleware, adminMiddleware };