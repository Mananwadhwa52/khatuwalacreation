const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true, min: 0 },
  mrp:         { type: Number },          // original price (for discount display)
  category:    { type: String, required: true, enum: ['radha-krishna','laddu-gopal','accessories','puja-items'] },
  subcategory: { type: String, trim: true },
  images:      [{ url: String, public_id: String }],
  badges:      [String],
  sizes:       [String],
  inStock:     { type: Boolean, default: true },
  featured:    { type: Boolean, default: false },
  stockCount:  { type: Number, default: 0 },
  sold:        { type: Number, default: 0 },
  ratings:     { type: Number, default: 0 },
  numReviews:  { type: Number, default: 0 },
}, { timestamps: true });

productSchema.index({ category: 1, featured: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
