import passport from 'passport';
import facebook from 'passport-facebook';
import google from 'passport-google-oauth';
import dotenv from 'dotenv';

dotenv.config();

const fbConfig = {
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['id', 'displayName', 'email'],
};

const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  profileFields: ['id', 'displayName', 'email', 'photos'],
};

passport.use(new facebook.Strategy(
  fbConfig,
  /* istanbul ignore next-line */
  (accessToken, refreshToken, profile, done) => done(null, profile)
));

passport.use(new google.OAuth2Strategy(
  /* istanbul ignore next-line */
  googleConfig,
  (accessToken, refreshToken, profile, done) => done(null, profile)
));
