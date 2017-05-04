import passport from 'passport-restify';
import passportJWT from 'passport-jwt';
import config from './config';
import users from './users';

const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
  secretOrKey: config.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeader()
};

const strategy = new Strategy(params, (payload, done) => {
  const user = users[payload.email] || null;
  if (user) {
    return done(null, {
      id: user.email
    });
  }

  return done(new Error('User not found'), null);
});
passport.use(strategy);

function initialize() {
  return passport.initialize();
}

function authenticate() {
  console.log('BEEEEPAUTH');
  return passport.authenticate('jwt', config.jwtSession);
}

module.exports = {
  initialize,
  authenticate
};
