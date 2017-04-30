const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');
const Entry = require('./models/entry');


// Use native promises
mongoose.Promise = global.Promise;

const server = restify.createServer();

server.use(restify.bodyParser({ mapParams: false }));

mongoose.connect(config.mongoDB);

// Create entry
server.post('/quengel/entry', (req, res) => {
  const entry = JSON.parse(req.body);

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
