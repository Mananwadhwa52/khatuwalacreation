const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

// ── Enhanced Admin Guard ──
// Re-verifies role from DB (prevents stale-JWT role escalation),
// logs every admin action, and checks for account suspension.
const adminOnly = async (req, res, next) => {
  try {
    // 1. Quick check from JWT-loaded user
    if (req.user?.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Admin access required' });

    // 2. Re-fetch from DB to prevent role escalation via stale token
    const freshUser = await User.findById(req.user._id).select('role isActive');
    if (!freshUser || freshUser.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin privileges revoked. Please login again.' });
    }

    // 3. Check if admin account is suspended
    if (freshUser.isActive === false) {
      return res.status(403).json({ success: false, message: 'Admin account suspended. Contact super admin.' });
    }

    // 4. Log admin action for audit trail
    const adminLog = {
      adminId:   req.user._id,
      adminName: req.user.name,
      method:    req.method,
      path:      req.originalUrl,
      ip:        req.ip || req.headers['x-forwarded-for'] || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      timestamp: new Date().toISOString(),
    };
    console.log('🔐 ADMIN ACTION:', JSON.stringify(adminLog));

    next();
  } catch (err) {
    console.error('❌ Admin middleware error:', err.message);
    res.status(500).json({ success: false, message: 'Authorization check failed' });
  }
};

// ── Super Admin Guard ──
// Only the original admin (from ADMIN_EMAIL env) can perform critical ops
// like managing other admins or accessing system settings.
const superAdminOnly = async (req, res, next) => {
  if (req.user?.email !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ success: false, message: 'Super admin access required' });
  }
  next();
};

module.exports = { protect, adminOnly, superAdminOnly };
