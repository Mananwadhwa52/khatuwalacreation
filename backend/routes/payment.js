const express  = require('express');
const router   = express.Router();
const Razorpay = require('razorpay');
const crypto   = require('crypto');
const asyncHandler = require('express-async-handler');
const Order    = require('../models/Order');
const Coupon   = require('../models/Coupon');
const { protect } = require('../middleware/auth');
const { sendMail, orderConfirmationHtml } = require('../utils/email');

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Apply coupon
router.post('/apply-coupon', asyncHandler(async (req, res) => {
  const { code, cartTotal } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
  if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code' });
  if (coupon.expiresAt && coupon.expiresAt < new Date())
    return res.status(400).json({ success: false, message: 'Coupon expired' });
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
    return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
  if (cartTotal < coupon.minOrder)
    return res.status(400).json({ success: false, message: `Minimum order ₹${coupon.minOrder} required` });

  let discount = coupon.type === 'percent'
    ? Math.round(cartTotal * coupon.value / 100)
    : coupon.value;
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);

  res.json({ success: true, discount, couponCode: coupon.code, message: `Coupon applied! You save ₹${discount}` });
}));

// Create Razorpay order
router.post('/create-order', asyncHandler(async (req, res) => {
  const { items, shippingAddress, guestEmail, couponCode, paymentMethod } = req.body;

  const itemsPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingPrice = itemsPrice >= 999 ? 0 : 99;
  let discountAmount = 0;

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode, active: true });
    if (coupon) {
      discountAmount = coupon.type === 'percent'
        ? Math.min(Math.round(itemsPrice * coupon.value / 100), coupon.maxDiscount || Infinity)
        : coupon.value;
    }
  }

  const totalPrice = Math.max(itemsPrice + shippingPrice - discountAmount, 0);

  // Create DB order first
  const order = await Order.create({
    user: req.headers.authorization ? req.user?._id : undefined,
    guestEmail,
    items, shippingAddress,
    itemsPrice, shippingPrice, discountAmount, totalPrice,
    couponCode, paymentMethod: paymentMethod || 'razorpay',
  });

  if (paymentMethod === 'cod') {
    order.orderStatus = 'confirmed';
    await order.save();
    const email = guestEmail || (await require('../models/User').findById(order.user))?.email;
    if (email) await sendMail({ to: email, subject: 'Order Confirmed – Khatu Walas Creation', html: orderConfirmationHtml(order) });
    return res.json({ success: true, order, isCOD: true });
  }

  // Razorpay order
  const rzpOrder = await razorpay.orders.create({
    amount: totalPrice * 100,
    currency: 'INR',
    receipt: order._id.toString(),
    notes: { orderId: order._id.toString() },
  });

  order.razorpayOrderId = rzpOrder.id;
  await order.save();

  res.json({
    success: true,
    rzpOrderId: rzpOrder.id,
    amount: totalPrice * 100,
    currency: 'INR',
    orderId: order._id,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
}));

// Verify payment
router.post('/verify', asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const sign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (sign !== razorpay_signature)
    return res.status(400).json({ success: false, message: 'Payment verification failed' });

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  order.paymentStatus  = 'paid';
  order.orderStatus    = 'confirmed';
  order.razorpayPaymentId  = razorpay_payment_id;
  order.razorpaySignature  = razorpay_signature;
  await order.save();

  if (order.couponCode) await Coupon.findOneAndUpdate({ code: order.couponCode }, { $inc: { usedCount: 1 } });

  const User = require('../models/User');
  const email = order.guestEmail || (await User.findById(order.user))?.email;
  if (email) await sendMail({ to: email, subject: 'Order Confirmed – Khatu Walas Creation 🙏', html: orderConfirmationHtml(order) });

  res.json({ success: true, order });
}));

module.exports = router;
