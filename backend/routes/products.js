const express  = require('express');
const router   = express.Router();
const asyncHandler = require('express-async-handler');
const Product  = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const { upload, cloudinary } = require('../middleware/cloudinary');

// GET all (public)
router.get('/', asyncHandler(async (req, res) => {
  const { category, featured, search, page = 1, limit = 12, sort = 'newest' } = req.query;
  const query = {};
  if (category) query.category = category;
  if (featured === 'true') query.featured = true;
  if (req.query.inStock === 'true') query.inStock = true;
  if (search) query.$text = { $search: search };

  const sortMap = { newest: { createdAt: -1 }, priceAsc: { price: 1 }, priceDesc: { price: -1 }, popular: { sold: -1 } };
  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    Product.find(query).sort(sortMap[sort] || { createdAt: -1 }).skip(skip).limit(Number(limit)),
    Product.countDocuments(query),
  ]);
  res.json({ success: true, products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
}));

// GET single (public)
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, product });
}));

// POST create (admin)
router.post('/', protect, adminOnly, upload.array('images', 6), asyncHandler(async (req, res) => {
  const { name, description, price, mrp, category, subcategory, badges, sizes, inStock, featured, stockCount } = req.body;
  const images = (req.files || []).map(f => ({ url: f.path, public_id: f.filename }));
  const product = await Product.create({
    name, description, price: Number(price), mrp: mrp ? Number(mrp) : undefined,
    category, subcategory,
    badges: badges ? JSON.parse(badges) : [],
    sizes:  sizes  ? JSON.parse(sizes)  : [],
    images, inStock: inStock !== 'false',
    featured: featured === 'true',
    stockCount: Number(stockCount) || 0,
  });
  res.status(201).json({ success: true, product });
}));

// PUT update (admin)
router.put('/:id', protect, adminOnly, upload.array('images', 6), asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Not found' });

  if (req.body.removeImages) {
    const toRemove = JSON.parse(req.body.removeImages);
    for (const pid of toRemove) await cloudinary.uploader.destroy(pid);
    product.images = product.images.filter(img => !toRemove.includes(img.public_id));
  }
  const newImages = (req.files || []).map(f => ({ url: f.path, public_id: f.filename }));
  product.images = [...product.images, ...newImages];

  const fields = ['name','description','category','subcategory'];
  fields.forEach(f => { if (req.body[f] !== undefined) product[f] = req.body[f]; });
  if (req.body.price     !== undefined) product.price     = Number(req.body.price);
  if (req.body.mrp       !== undefined) product.mrp       = Number(req.body.mrp);
  if (req.body.stockCount!== undefined) product.stockCount= Number(req.body.stockCount);
  if (req.body.badges    !== undefined) product.badges    = JSON.parse(req.body.badges);
  if (req.body.sizes     !== undefined) product.sizes     = JSON.parse(req.body.sizes);
  if (req.body.inStock   !== undefined) product.inStock   = req.body.inStock !== 'false';
  if (req.body.featured  !== undefined) product.featured  = req.body.featured === 'true';

  await product.save();
  res.json({ success: true, product });
}));

// DELETE (admin)
router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Not found' });
  for (const img of product.images) await cloudinary.uploader.destroy(img.public_id);
  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted' });
}));

module.exports = router;
