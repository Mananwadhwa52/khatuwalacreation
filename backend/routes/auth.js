const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const asyncHandler = require('express-async-handler');
const User    = require('../models/User');
const { protect, adminOnly, superAdminOnly } = require('../middleware/auth');

const genToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// ── Auth-specific rate limiter (brute-force protection) ──
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 10,                     // 10 attempts per window
  message: { success: false, message: 'Too many attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Register
router.post('/register', authLimiter, asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Input validation
  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'Name, email and password are required' });
  if (password.length < 8)
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });

  if (await User.findOne({ email }))
    return res.status(400).json({ success: false, message: 'Email already registered' });

  // Prevent role injection — always force 'user' role on registration
  const user = await User.create({ name, email, password, phone, role: 'user' });
  res.status(201).json({ success: true, token: genToken(user._id, user.role), user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
}));

// Login (with brute-force lockout)
router.post('/login', authLimiter, asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password are required' });

  const user = await User.findOne({ email });

  // ── Account lockout check ──
  if (user && user.isLocked) {
    const minsLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
    return res.status(423).json({
      success: false,
      message: `Account locked due to too many failed attempts. Try again in ${minsLeft} minute(s).`,
    });
  }

  // ── Account suspension check ──
  if (user && user.isActive === false) {
    return res.status(403).json({ success: false, message: 'Account suspended. Contact support.' });
  }

  if (!user || !(await user.matchPassword(password))) {
    // Increment failed attempts if user exists
    if (user) await user.incLoginAttempts();
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // ── Successful login — reset attempts ──
  await user.resetLoginAttempts();
  res.json({ success: true, token: genToken(user._id, user.role), user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
}));

// Me
router.get('/me', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -loginAttempts -lockUntil').populate('wishlist', 'name images price');
  res.json({ success: true, user });
}));

// Update profile
router.put('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, phone, password } = req.body;
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (password) {
    if (password.length < 8)
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    user.password = password;
  }
  await user.save();
  res.json({ success: true, message: 'Profile updated' });
}));

// Add address
router.post('/address', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) user.addresses.forEach(a => a.isDefault = false);
  user.addresses.push(req.body);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
}));

// Wishlist toggle
router.post('/wishlist/:productId', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const pid  = req.params.productId;
  const idx  = user.wishlist.indexOf(pid);
  if (idx > -1) user.wishlist.splice(idx, 1);
  else user.wishlist.push(pid);
  await user.save();
  res.json({ success: true, wishlist: user.wishlist });
}));

// ══════════════════════════════════════════════
//  SECURED ADMIN ROUTES
// ══════════════════════════════════════════════

// Seed admin (secured — requires SEED_SECRET, disabled in production)
router.post('/seed-admin', asyncHandler(async (req, res) => {
  // Block in production
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, message: 'Route disabled in production' });
  }

  // Require seed secret
  const { seedSecret } = req.body;
  if (!seedSecret || seedSecret !== process.env.SEED_SECRET) {
    console.warn('⚠️  Unauthorized seed-admin attempt from IP:', req.ip);
    return res.status(403).json({ success: false, message: 'Invalid seed secret' });
  }

  if (await User.findOne({ role: 'admin' }))
    return res.status(400).json({ success: false, message: 'Admin already exists' });

  const admin = await User.create({
    name: process.env.ADMIN_NAME || 'Admin',
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: 'admin',
  });
  console.log('✅ Admin seeded:', admin.email);
  res.status(201).json({ success: true, message: 'Admin created', email: admin.email });
}));

// Admin: get all users (with security fields hidden)
router.get('/users', protect, adminOnly, asyncHandler(async (req, res) => {
  const users = await User.find()
    .select('-password -loginAttempts -lockUntil')
    .sort('-createdAt');
  res.json({ success: true, users });
}));

// Admin: suspend/activate user account (super admin only)
router.put('/users/:id/status', protect, adminOnly, superAdminOnly, asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  // Prevent super admin from suspending themselves
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({ success: false, message: 'Cannot suspend your own account' });
  }

  user.isActive = isActive;
  await user.save();
  console.log(`🔐 ADMIN: User ${user.email} ${isActive ? 'activated' : 'suspended'} by ${req.user.email}`);
  res.json({ success: true, message: `User ${isActive ? 'activated' : 'suspended'}` });
}));

// Admin: unlock a locked user account (admin only)
router.put('/users/:id/unlock', protect, adminOnly, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  await user.updateOne({ $set: { loginAttempts: 0 }, $unset: { lockUntil: 1 } });
  console.log(`🔐 ADMIN: User ${user.email} unlocked by ${req.user.email}`);
  res.json({ success: true, message: 'User account unlocked' });
}));

module.exports = router;




