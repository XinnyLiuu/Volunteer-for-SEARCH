const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const OAuthStrategy = require('passport-oauth').OAuthStrategy;
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

const User = require('../models/User');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
/**
 * Sign in with Google.
 */
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: '/login/google/return',
  scope : ['profile','email'],
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  if (req.user) {
    User.findOne({ google: profile.id }, (err, existingUser) => {
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        done(err);
      } else {
        User.findById(req.user.id, (err, user) => {
          user.google = profile.id;
          user.tokens.push({ kind: 'google', accessToken });
          user.firstName = user.firstName || profile.displayName;
          user.gender = user.gender || profile._json.gender;
          user.profile.picture = user.profile.picture || profile._json.image.url;
          user.save((err) => {
            req.flash('info', { msg: 'Google account has been linked.' });
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({ google: profile.id }, (err, existingUser) => {
      if (existingUser) {
        return done(null, existingUser);
      }
      User.findOne({ email: profile.emails[0].value }, (err, existingEmailUser) => {
        if (existingEmailUser) {
          existingEmailUser.google = profile.id;
          existingEmailUser.tokens.push({ kind: 'google', accessToken });
          existingEmailUser.firstName = existingEmailUser.firstName || profile.displayName;
          existingEmailUser.gender = existingEmailUser.gender || profile._json.gender;
          existingEmailUser.profile.picture = existingEmailUser.profile.picture || profile._json.image.url;
          existingEmailUser.save((err) => {
            req.flash('info', { msg: 'Google account has been linked.' });
            done(err, existingEmailUser);
          });
        } else {
          const user = new User();
          user.email = profile.emails[0].value;
          user.google = profile.id;
          user.tokens.push({ kind: 'google', accessToken });
          user.firstName = profile.displayName;
          user.gender = profile._json.gender;
          user.profile.picture = profile._json.image.url;
          user.save((err) => {
            done(err, user);
          });
        }
      });
    });
  }
}));
