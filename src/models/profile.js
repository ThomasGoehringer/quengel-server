const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const profileSchema = new Schema({
  email: String,
  password: String,
  name: String,
  birthday: Date,
  entries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entry'
  }],
  createdAt: Date,
  updatedAt: Date
});

profileSchema.pre('save', function (next) {
  const currentDate = new Date();
  this.updatedAt = currentDate;
  if (!this.createdAt) {
    this.createdAt = currentDate;
  }
  next();
});

const Profile = mongoose.model('Entry', profileSchema);

module.exports = Profile;
