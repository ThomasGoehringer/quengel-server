import mongoose from 'mongoose';


const Schema = mongoose.Schema;
const entrySchema = new Schema({
  text: [{
    value: String,
    emotion: String,
    createdAt: Date
  }],
  badges: [{
    badgeType: String,
    value: String,
    unit: String,
    createdAt: Date
  }],
  imagePath: String,
  milestone: Boolean,
  createdAt: Date,
  updatedAt: Date
});


module.exports = entrySchema;
