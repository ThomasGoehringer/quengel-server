import mongoose from 'mongoose';


const Schema = mongoose.Schema;
const questionSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  category: String,
  title: String,
  text: String,
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
});

questionSchema.pre('save', function (next) {
  const currentDate = new Date();
  this.updatedAt = currentDate;

  if (!this.createdAt) {
    this.createdAt = currentDate;
  }

  next();
});


const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
