const mongoose = require('mongoose');

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

// Initial data
Entry
  .find()
  .then((entries) => {
    if (!entries.length) {
      new Entry({
        text: [
          {
            value: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            createdAt: '2017-04-28T16:33:42.732Z'
          },
          {
            value: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            emotion: 'neutral',
            createdAt: '2017-04-28T16:34:42.732Z'
          },
          {
            emotion: 'happy',
            createdAt: '2017-04-28T16:35:42.732Z'
          }
        ],
        badges: [
          {
            badgeType: 'diapers',
            value: '5',
            unit: null,
            createdAt: '2017-04-28T16:33:42.732Z'
          },
          {
            badgeType: 'hydration',
            value: '1250',
            unit: 'ml',
            createdAt: '2017-04-28T16:33:42.732Z'
          },
          {
            badgeType: 'meals',
            value: '3',
            unit: null,
            createdAt: '2017-04-28T16:33:42.732Z'
          },
          {
            badgeType: 'weight',
            value: '2500',
            unit: 'g',
            createdAt: '2017-04-28T16:33:42.732Z'
          }
        ],
        milestone: false,
        createdAt: '2017-04-27T15:00:42.732Z'
      }).save();

      new Entry({
        text: [
          {
            value: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            createdAt: '2017-04-28T16:33:42.732Z'
          }
        ],
        badges: [
          {
            badgeType: 'diapers',
            value: '5',
            unit: null,
            createdAt: '2017-04-28T16:33:42.732Z'
          },
          {
            badgeType: 'hydration',
            value: '1050',
            unit: 'ml',
            createdAt: '2017-04-28T16:33:42.732Z'
          },
          {
            badgeType: 'headCircumference',
            value: '72',
            unit: 'cm',
            createdAt: '2017-04-28T16:33:42.732Z'
          },
          {
            badgeType: 'weight',
            value: '2700',
            unit: 'g',
            createdAt: '2017-04-28T16:33:42.732Z'
          },
          {
            badgeType: 'nursing',
            value: '4:38',
            unit: 'min',
            createdAt: '2017-04-28T16:33:42.732Z'
          }
        ],
        milestone: false,
        createdAt: '2017-04-28T16:33:42.732Z'
      }).save();

      new Entry({
        text: [
          {
            value: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            createdAt: '2017-04-28T16:33:42.732Z'
          },
          {
            value: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            createdAt: '2017-04-28T16:34:42.732Z'
          },
          {
            value: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            createdAt: '2017-04-28T16:35:42.732Z'
          }
        ],
        badges: [
          {
            badgeType: 'diapers',
            value: '5',
            unit: null,
            createdAt: '2017-04-28T16:33:42.732Z'
          },
          {
            badgeType: 'hydration',
            value: '1450',
            unit: 'ml',
            createdAt: '2017-04-28T16:33:42.732Z'
          },
          {
            badgeType: 'meals',
            value: '3',
            unit: null,
            createdAt: '2017-04-28T16:33:42.732Z'
          },
          {
            badgeType: 'height',
            value: '94',
            unit: 'cm',
            createdAt: '2017-04-28T16:33:42.732Z'
          }
        ],
        milestone: false,
        createdAt: '2017-04-29T16:33:42.732Z'
      }).save();
    }
  });

module.exports = Entry;
