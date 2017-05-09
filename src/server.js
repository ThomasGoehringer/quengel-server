import restify from 'restify';
import mongoose from 'mongoose';
import moment from 'moment';
import ld from 'lodash';
import jwt from 'jwt-simple';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport-restify';
import config from './config';
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
  // Search if user exists in db
  const userId = payload;
  User
    .findOne({ email: userId })
    .then((user) => {
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    })
    .catch(err => done(err, false));
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
  User
    .findOne({ email: req.user.email })
    .then((user) => {
      const latestEntry = user.entries[user.entries.length - 1];
      const newEntry = {
        text: entry.text,
        badges: entry.badges,
        milestone: entry.milestone,
        createdAt: new Date()
      };

      if (latestEntry && moment(latestEntry.createdAt).format('DD MMM YY') === moment().format('DD MMM YY')) {
        const mergedEntry = ld.mergeWith(latestEntry, entry, customizer);
        mergedEntry.createdAt = latestEntry.createdAt;

        User
          .update(
            { email: req.user.email, 'entries.createdAt': latestEntry.createdAt },
            { $set: { 'entries.$': mergedEntry } }
          )
          .then(() => {
            res.status(200);
          })
          .catch(err => console.error(err));
      } else {
        User
          .update(
            { email: req.user.email },
            { $push: { entries: newEntry } }
          )
          .then(() => {
            res.status(200);
          })
          .catch(err => console.error(err));
      }

      res.send();
    })
    .catch(err => console.log(err));
});

// Get all entries
server.get('/quengel/entries', requireAuth, (req, res) => {
  User
    .findOne({ email: req.user.email })
    .then((user) => {
      res.send(user.entries);
    });
});

server.post('/quengel/user/profile', requireAuth, (req, res) => {
  const profile = JSON.parse(req.body);
  User
    .update(
      { email: req.user.email },
      { $set: { name: profile.name, dateOfBirth: profile.dateOfBirth, gender: profile.gender } }
    )
    .then(() => res.send());
});

server.get('/quengel/user/profile', requireAuth, (req, res) => {
  User
    .findOne({ email: req.user.email })
    .then((user) => {
      const profile = {
        name: user.name,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth
      };

      res.send(profile);
    });
});

server.post('/quengel/user/register', (req, res) => {
  const newUser = JSON.parse(req.body);

  if (newUser.email && newUser.password) {
    const email = newUser.email;
    const password = newUser.password;

    // Save user to db
    // TODO Prevent creation of multiple users
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
    res.send(401);
  }
});

server.post('/quengel/user/login', (req, res) => {
  const reqUser = JSON.parse(req.body);

  if (reqUser.email && reqUser.password) {
    // Find user in db
    User
      .findOne({ email: reqUser.email })
      .then((user) => {
        if (user) {
          user.comparePassword(reqUser.password).then((isMatch) => {
            if (isMatch) {
              // Issues JWT
              const token = jwt.encode(reqUser.email, config.jwtSecret);
              res.send({ token });
            } else {
              res.send(401);
            }
          });
        } else {
          res.send(401);
        }
      });
  } else {
    res.send(401);
  }
});

server.listen(8080, () => {
  console.log('%s listening at %s', server.name, server.url);
});
