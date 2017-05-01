import restify from 'restify';
import mongoose from 'mongoose';
import moment from 'moment';
import merge from 'lodash.merge';
import config from './config';
import Entry from './models/entry';


// Use native promises
mongoose.Promise = global.Promise;

const server = restify.createServer();

server.use(restify.bodyParser({ mapParams: false }));

mongoose.connect(config.mongoDB);

// Create entry
server.post('/quengel/entry', (req, res) => {
  const entry = JSON.parse(req.body);

  // Merge if an entry with the same createdAt (DD MM YY) is already in the db
  Entry
    .findOne()
    .sort({ createdAt: -1 })
    .then((latestEntry) => {
      if (moment(latestEntry.createdAt).format('DD MMM YY') === moment().format('DD MMM YY')) {
        // Merge since there is already an entry for today
        console.log('MERGE', merge(latestEntry, entry));
        console.log('MERGEENTRYDB', latestEntry);
        console.log('MERGEENTRYPOST', entry);
        Entry.update({ createdAt: latestEntry.createdAt }, merge(latestEntry, entry), () => {
          console.log('UPDATED');
          res.send();
        });
      } else {
        // Create new Entry since there is no entry for today
        new Entry({
          text: entry.text,
          badges: entry.badges,
          milestone: entry.milestone
        }).save((err) => {
          if (err) {
            console.log(err);
            res.status(500);
          } else {
            res.status(200);
          }
          res.send();
        });
      }
    });
});

// Get all entries
server.get('/quengel/entries', (req, res) => {
  Entry
    .find()
    .then((entries) => {
      res.send(entries);
    });
});


server.listen(8080, () => {
  console.log('%s listening at %s', server.name, server.url);
});
