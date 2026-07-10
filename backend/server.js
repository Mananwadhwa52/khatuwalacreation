const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

dotenv.config();
const app = express();

// ── Security headers (Helmet) ──
// Sets X-Content-Type-Options, X-Frame-Options, HSTS, CSP, etc.
app.use(helmet());

// ── Global rate limiting ──
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

// ── Contact form rate limiter (anti-spam) ──
app.use('/api/contact', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many messages. Please try again later.' },
}));

// ── CORS (hardened) ──
const allowedOrigins = [
  process.env.FRONTEND_URL,          // From env (should be https://mananwadhwa.in on Render)
  'https://mananwadhwa.in',          // Live Domain (hardcoded as safety net)
  'https://www.mananwadhwa.in',      // www version
  'https://khatuwalacreation.onrender.com', // Render backend itself
  'http://localhost:5173',           // Local development
  'http://localhost:5000',           // Local backend
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body parsing ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── NoSQL injection prevention ──
// Strips $ and . from req.body, req.query, req.params
app.use(mongoSanitize());

// ── XSS protection ──
// Sanitizes user input to prevent stored/reflected XSS
app.use(xss());

// ── Routes ──
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/payment',  require('./routes/payment'));
app.use('/api/contact',  require('./routes/contact'));
app.use('/api/reviews',  require('./routes/reviews'));
app.use('/api/coupons', require('./routes/coupons'));

// ── Health ──
app.get('/', (_, res) => res.json({ status: 'ok', message: '🙏 Khatu Walas API running' }));

// ── Error handler ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  // Hide stack trace in production
  const message = process.env.NODE_ENV === 'production' ? 'Server error' : err.message || 'Server error';
  res.status(err.status || 500).json({ success: false, message });
});

// ── DB + Start ──
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => { console.error('❌ MongoDB error:', err.message); process.exit(1); });
