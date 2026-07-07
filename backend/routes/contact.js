const express  = require('express');
const router   = express.Router();
const asyncHandler = require('express-async-handler');
const Contact  = require('../models/Contact');
const { protect, adminOnly } = require('../middleware/auth');
const { sendMail } = require('../utils/email');

router.post('/', asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  const contact = await Contact.create({ name, email, phone, subject, message });
  await sendMail({
    to: process.env.EMAIL_USER,
    subject: `New Contact: ${subject || 'General Inquiry'} – ${name}`,
    html: `<p><b>From:</b> ${name} (${email})<br/><b>Phone:</b> ${phone || 'N/A'}</p><p>${message}</p>`,
  });
  res.status(201).json({ success: true, message: 'Message sent! We will reply within 24 hours.' });
}));

router.get('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort('-createdAt');
  res.json({ success: true, contacts });
}));

router.put('/:id/read', protect, adminOnly, asyncHandler(async (req, res) => {
  await Contact.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ success: true });
}));

module.exports = router;
