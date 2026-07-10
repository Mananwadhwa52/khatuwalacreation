const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');
const { protect, adminOnly } = require('../middleware/auth');

// Get all coupons (admin)
router.get('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort('-createdAt');
  res.json({ success: true, coupons });
}));

// Create coupon (admin)
router.post('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const { code, type, value, minOrder, maxDiscount, usageLimit, active, expiresAt } = req.body;
  if (!code || !type || !value) return res.status(400).json({ success: false, message: 'Code, type and value are required' });
  
  const existing = await Coupon.findOne({ code: code.toUpperCase() });
  if (existing) return res.status(400).json({ success: false, message: 'Coupon code already exists' });
  
  const coupon = await Coupon.create({
    code: code.toUpperCase(), type, value,
    minOrder: minOrder || 0,
    maxDiscount: maxDiscount || undefined,
    usageLimit: usageLimit || 1,
    active: active !== undefined ? active : true,
    expiresAt: expiresAt || undefined,
  });
  res.status(201).json({ success: true, coupon });
}));

// Update coupon (admin)
router.put('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
  
  const { code, type, value, minOrder, maxDiscount, usageLimit, active, expiresAt } = req.body;
  if (code) coupon.code = code.toUpperCase();
  if (type) coupon.type = type;
  if (value !== undefined) coupon.value = value;
  if (minOrder !== undefined) coupon.minOrder = minOrder;
  if (maxDiscount !== undefined) coupon.maxDiscount = maxDiscount;
  if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
  if (active !== undefined) coupon.active = active;
  if (expiresAt !== undefined) coupon.expiresAt = expiresAt || null;
  
  await coupon.save();
  res.json({ success: true, coupon });
}));

// Delete coupon (admin)
router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
  await coupon.deleteOne();
  res.json({ success: true, message: 'Coupon deleted' });
}));

module.exports = router;
