import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import EntrySchema from '../schemas/entry';


const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String,
  name: String,
  birthday: Date,
  entries: [EntrySchema],
  createdAt: Date,
  updatedAt: Date
});

userSchema.pre('save', function (next) {
  const currentDate = new Date();
  this.updatedAt = currentDate;
  if (!this.createdAt) {
    this.createdAt = currentDate;
  }

  const user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    })
  });

  next();
});

userSchema.methods.comparePassword = (candidatePassword, cb) => {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
