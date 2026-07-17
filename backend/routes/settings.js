const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { protect, adminOnly } = require('../middleware/auth');

const initSettings = async () => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      await Settings.create({
        codEnabled: true,
        collections: [
          { title: 'Radha Krishna', value: 'radha-krishna', desc: 'Poshaks, Shringar & Jewellery Sets', color: 'from-rose-100 to-pink-50', accent: '#570000', imageurl: 'https://i.ibb.co/DPkgMHZx/file-000000007f847208ada30b449c72a0f1.png' },
          { title: 'Laddu Gopal', value: 'laddu-gopal', desc: 'Size 0 to 10 — All Seasons', color: 'from-amber-100 to-yellow-50', accent: '#8d4f11', imageurl: 'https://i.ibb.co/gMngmcBQ/file-00000000b024720896937019d17cf461.png' },
          { title: 'Accessories', value: 'accessories', desc: 'Crowns, Flutes, Swings & More', color: 'from-teal-100 to-cyan-50', accent: '#002c2c', imageurl: 'https://i.ibb.co/VYt3fFJs/file-000000008cc872089a2fb7a7fbbdf1a7.png' },
          { title: 'Puja Items', value: 'puja-items', desc: 'Diyas, Incense & Ritual Items', color: 'from-purple-100 to-violet-50', accent: '#3b0764', imageurl: 'https://i.ibb.co/81gsr1M/file-0000000068ac72089454ff1afa2e4d4f.png' },
          { title: 'Khatu Shyam Baba', value: 'khatu-shyam-baba', desc: 'Idols, Poshaks & Devotional Items', color: 'from-orange-100 to-amber-50', accent: '#9a3412', imageurl: 'https://i.ibb.co/C3D1ykBd/IMG-20260709-223701-png.png' },
        ]
      });
    }
  } catch (error) {
    console.error('Error initializing settings:', error);
  }
};
initSettings();

router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/', protect, adminOnly, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      if (req.body.codEnabled !== undefined) settings.codEnabled = req.body.codEnabled;
      if (req.body.collections !== undefined) settings.collections = req.body.collections;
    }
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
