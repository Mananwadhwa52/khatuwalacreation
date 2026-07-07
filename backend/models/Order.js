const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:      String,
  image:     String,
  price:     Number,
  size:      String,
  quantity:  { type: Number, default: 1 },
});

const addressSchema = new mongoose.Schema({
  fullName: String, phone: String,
  line1: String, line2: String,
  city: String, state: String, pincode: String,
});

const orderSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  guestEmail:  String,   // for guest checkout
  items:       [orderItemSchema],
  shippingAddress: addressSchema,
  itemsPrice:     { type: Number, required: true },
  shippingPrice:  { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  totalPrice:     { type: Number, required: true },
  couponCode:     String,
  paymentMethod:  { type: String, enum: ['razorpay','cod'], default: 'razorpay' },
  paymentStatus:  { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
  razorpayOrderId:   String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  orderStatus: {
    type: String,
    enum: ['placed','confirmed','processing','shipped','delivered','cancelled','refund_requested','refunded'],
    default: 'placed',
  },
  trackingNumber: String,
  trackingUrl:    String,
  notes:          String,
  refundReason:   String,
  refundDate:     Date,
  deliveredAt:    Date,
  cancelledAt:    Date,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
