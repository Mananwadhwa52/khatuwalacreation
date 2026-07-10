const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const sendMail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html });
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

const orderConfirmationHtml = (order) => `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:24px;background:#FAF6F0;border:1px solid #D4AF37;">
  <h2 style="color:#570000;text-align:center;">🙏 Order Confirmed — Khatu Walas Creation</h2>
  <p>Dear ${order.shippingAddress?.fullName || 'Devotee'},</p>
  <p>Your order <strong>#${order._id}</strong> has been placed successfully.</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0;">
    <thead><tr style="background:#570000;color:#fff;"><th style="padding:8px;text-align:left;">Item</th><th style="padding:8px;">Qty</th><th style="padding:8px;">Price</th></tr></thead>
    <tbody>${order.items.map(i => `<tr><td style="padding:8px;border-bottom:1px solid #eee;">${i.name}${i.size ? ' ('+i.size+')' : ''}</td><td style="padding:8px;text-align:center;">${i.quantity}</td><td style="padding:8px;text-align:right;">₹${i.price * i.quantity}</td></tr>`).join('')}</tbody>
  </table>
  <p><strong>Total: ₹${order.totalPrice}</strong> | Payment: ${order.paymentMethod.toUpperCase()}</p>
  <p style="color:#570000;font-style:italic;">Jai Shree Radhe Krishna 🌸</p>
</div>`;

const passwordResetHtml = (name, resetUrl) => `
<!DOCTYPE html>
<html><body style="font-family:Arial,sans-serif;background:#f9f6f1;padding:40px 0;">
<div style="max-width:500px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #e8dcc8;">
  <h2 style="color:#570000;margin-bottom:8px;">Password Reset Request</h2>
  <p style="color:#666;">Hi ${name || 'there'},</p>
  <p style="color:#666;">You requested a password reset for your Khatu Walas Creation account. Click the button below to set a new password:</p>
  <div style="text-align:center;margin:24px 0;">
    <a href="${resetUrl}" style="background:#570000;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">Reset Password</a>
  </div>
  <p style="color:#999;font-size:12px;">This link expires in 30 minutes. If you didn't request this, please ignore this email.</p>
  <hr style="border:none;border-top:1px solid #e8dcc8;margin:20px 0;"/>
  <p style="color:#999;font-size:11px;text-align:center;">🙏 Khatu Walas Creation</p>
</div>
</body></html>
`;

module.exports = { sendMail, orderConfirmationHtml, passwordResetHtml };
