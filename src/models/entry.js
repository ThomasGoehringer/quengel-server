const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const entrySchema = new Schema({
  text: [{
    value: String,
    createdAt: Date
  }],
  badges: [{
    badgeType: String,
    value: String,
    createdAt: Date
  }],
  milestone: Boolean,
  createdAt: Date,
  updatedAt: Date
});

entrySchema.pre('save', function (next) {
  const currentDate = new Date();
  this.updatedAt = currentDate;
  if (!this.createdAt) {
    this.createdAt = currentDate;
  }
  next();
});

const Entry = mongoose.model('Entry', entrySchema);

module.exports = Entry;
