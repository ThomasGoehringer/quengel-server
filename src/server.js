const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');


// Use native promises
mongoose.Promise = global.Promise;

const server = restify.createServer();

mongoose.connect(config.mongoDB);

server.get('/example/:route', (req, res) => {

});


server.listen(8080, () => {
  console.log('%s listening at %s', server.name, server.url);
});
