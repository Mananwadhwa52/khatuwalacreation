const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema({
  code:        { type: String, required: true, unique: true, uppercase: true },
  type:        { type: String, enum: ['percent','flat'], required: true },
  value:       { type: Number, required: true },
  minOrder:    { type: Number, default: 0 },
  maxDiscount: { type: Number },
  usageLimit:  { type: Number, default: 1 },
  usedCount:   { type: Number, default: 0 },
  active:      { type: Boolean, default: true },
  expiresAt:   Date,
}, { timestamps: true });
module.exports = mongoose.model('Coupon', couponSchema);
