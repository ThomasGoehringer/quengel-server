import restify from 'restify';
import mongoose from 'mongoose';
import moment from 'moment';
import ld from 'lodash';
import jwt from 'jwt-simple';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport-restify';
import config from './config';
import Entry from './models/entry';
import User from './models/user';


// Use native promises
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoDB);

const server = restify.createServer();
server.use(restify.bodyParser({ mapParams: false }));
server.use(passport.initialize());

const requireAuth = passport.authenticate('jwt', { session: false });

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: config.jwtSecret
};

passport.use(new JwtStrategy(opts, (payload, done) => {
  // TODO search if user exists in db
  const userId = payload.email;
  User
    .findOne({ email: userId })
    .then((err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
}));


function customizer(objValue, srcValue) {
  if (ld.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

// Create entry
server.post('/quengel/entry', requireAuth, (req, res) => {
  const entry = JSON.parse(req.body);

  // Merge if an entry with the same createdAt (DD MM YY) is already in the db
  Entry
    .findOne()
    .sort({ createdAt: -1 })
    .then((latestEntry) => {
      if (moment(latestEntry.createdAt).format('DD MMM YY') === moment().format('DD MMM YY')) {
        // Merge since there is already an entry for today
        Entry.update(
          { createdAt: latestEntry.createdAt },
          ld.mergeWith(latestEntry, entry, customizer), () => res.send()
        );
      } else {
        // Create new Entry since there is no entry for today
        new Entry({
          text: entry.text,
          badges: entry.badges,
          milestone: entry.milestone
        }).save((err, entry) => {
          if (err) {
            console.log(err);
            res.status(500);
          } else {
            res.status(200);
          }

          // Find user and add new entry ObjectId to user's entries
          User.findOneAndUpdate(
            { email: req.user.email },
            { $push: { entries: entry._id } }
          );

          res.send();
        });
      }
    });
});

// Get all entries
server.get('/quengel/entries', requireAuth, (req, res) => {
  Entry
    .find()
    .then((entries) => {
      res.send(entries);
    });
});

server.post('/user/register', (req, res) => {
  const newUser = req.body;

  if (newUser.email && newUser.password) {
    const email = newUser.email;
    const password = newUser.password;

    // TODO save user to db and issue token
    User
      .findOne({ email })
      .then((err, user) => {
        if (!user) {
          new User({
            email,
            password
          }).save();
        }
      });

    // Issues JWT
    const token = jwt.encode(email, config.jwtSecret);
    res.send({ token });
  } else {
    res.status(401);
    res.send();
  }
});

server.listen(8080, () => {
  console.log('%s listening at %s', server.name, server.url);
});
