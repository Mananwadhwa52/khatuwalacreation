const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  fullName:  String,
  phone:     String,
  line1:     String,
  line2:     String,
  city:      String,
  state:     String,
  pincode:   String,
  isDefault: { type: Boolean, default: false },
}, { _id: true });

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true, minlength: 6 },
  phone:     { type: String },
  role:      { type: String, enum: ['admin', 'user'], default: 'user' },
  isActive:  { type: Boolean, default: true },
  addresses: [addressSchema],
  wishlist:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  // ── Security fields ──
  loginAttempts: { type: Number, default: 0 },
  lockUntil:     { type: Date },
  lastLogin:     { type: Date },
}, { timestamps: true });

// Virtual: check if account is currently locked
userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Method: increment failed login attempts, lock after 5 failures
userSchema.methods.incLoginAttempts = async function () {
  // If lock has expired, reset attempts
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({ $set: { loginAttempts: 1 }, $unset: { lockUntil: 1 } });
  }
  const updates = { $inc: { loginAttempts: 1 } };
  // Lock account after 5 failed attempts for 30 minutes
  if (this.loginAttempts + 1 >= 5) {
    updates.$set = { lockUntil: Date.now() + 30 * 60 * 1000 };
  }
  return this.updateOne(updates);
};

// Method: reset login attempts on successful login
userSchema.methods.resetLoginAttempts = async function () {
  return this.updateOne({ $set: { loginAttempts: 0, lastLogin: new Date() }, $unset: { lockUntil: 1 } });
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.matchPassword = function (pw) { return bcrypt.compare(pw, this.password); };

module.exports = mongoose.model('User', userSchema);
