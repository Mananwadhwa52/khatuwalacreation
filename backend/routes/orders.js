const express  = require('express');
const router   = express.Router();
const asyncHandler = require('express-async-handler');
const Order    = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');
const { sendMail } = require('../utils/email');

// My orders
router.get('/my', protect, asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt').populate('items.product','name images');
  res.json({ success: true, orders });
}));

// Single order (owner or admin)
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product','name images');
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  if (order.user?.toString() !== req.user._id.toString() && req.user.role !== 'admin')
    return res.status(403).json({ success: false, message: 'Not authorized' });
  res.json({ success: true, order });
}));

// Request refund
router.post('/:id/refund', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  if (order.user?.toString() !== req.user._id.toString())
    return res.status(403).json({ success: false, message: 'Not authorized' });
  if (!['delivered','confirmed','processing'].includes(order.orderStatus))
    return res.status(400).json({ success: false, message: 'Order cannot be refunded at this stage' });

  order.orderStatus = 'refund_requested';
  order.refundReason = req.body.reason || 'Not specified';
  await order.save();
  res.json({ success: true, message: 'Refund request submitted. We will process within 5-7 business days.' });
}));

// Cancel order
router.post('/:id/cancel', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  if (order.user?.toString() !== req.user._id.toString())
    return res.status(403).json({ success: false, message: 'Not authorized' });
  if (!['placed','confirmed'].includes(order.orderStatus))
    return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
  order.orderStatus = 'cancelled';
  order.cancelledAt = new Date();
  await order.save();
  res.json({ success: true, message: 'Order cancelled' });
}));

// ─── ADMIN ───
// All orders
router.get('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = status ? { orderStatus: status } : {};
  const skip = (Number(page) - 1) * Number(limit);
  const [orders, total] = await Promise.all([
    Order.find(query).sort('-createdAt').skip(skip).limit(Number(limit)).populate('user','name email'),
    Order.countDocuments(query),
  ]);
  res.json({ success: true, orders, total });
}));

// Update order status (admin)
router.put('/:id/status', protect, adminOnly, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  const { status, trackingNumber, trackingUrl } = req.body;
  order.orderStatus = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (trackingUrl) order.trackingUrl = trackingUrl;
  if (status === 'delivered') order.deliveredAt = new Date();
  if (status === 'refunded')  order.refundDate = new Date();
  await order.save();
  res.json({ success: true, order });
}));

// Dashboard stats (admin)
router.get('/admin/stats', protect, adminOnly, asyncHandler(async (req, res) => {
  const [totalRevenue, totalOrders, pendingOrders, deliveredOrders] = await Promise.all([
    Order.aggregate([{ $match: { paymentStatus: 'paid', orderStatus: { $nin: ['cancelled', 'refunded'] } } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    Order.countDocuments(),
    Order.countDocuments({ orderStatus: { $in: ['placed','confirmed','processing'] } }),
    Order.countDocuments({ orderStatus: 'delivered' }),
  ]);
  res.json({
    success: true,
    revenue: totalRevenue[0]?.total || 0,
    totalOrders, pendingOrders, deliveredOrders,
  });
}));

// Delete cancelled order (admin only)
router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  if (order.orderStatus !== 'cancelled')
    return res.status(400).json({ success: false, message: 'Only cancelled orders can be deleted' });
  await order.deleteOne();
  res.json({ success: true, message: 'Order deleted' });
}));

module.exports = router;
