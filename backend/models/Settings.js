const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  codEnabled: { type: Boolean, default: true },
  collections: [{
    title: String,
    value: String,
    desc: String,
    color: String,
    accent: String,
    imageurl: String
  }]
});

module.exports = mongoose.model('Settings', settingsSchema);
