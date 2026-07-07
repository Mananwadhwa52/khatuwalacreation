// routes/reviews.js
const express  = require('express');
const router   = express.Router();
const asyncHandler = require('express-async-handler');
const Review   = require('../models/Review');
const Product  = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/product/:productId', asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).sort('-createdAt');
  res.json({ success: true, reviews });
}));

router.post('/', protect, asyncHandler(async (req, res) => {
  const { productId, rating, title, comment } = req.body;
  const existing = await Review.findOne({ product: productId, user: req.user._id });
  if (existing) return res.status(400).json({ success: false, message: 'Already reviewed' });

  const review = await Review.create({ product: productId, user: req.user._id, name: req.user.name, rating, title, comment });

  // Update product rating
  const reviews = await Review.find({ product: productId });
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  await Product.findByIdAndUpdate(productId, { ratings: avg.toFixed(1), numReviews: reviews.length });

  res.status(201).json({ success: true, review });
}));

router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Review deleted' });
}));

module.exports = router;
