import passport from "passport";
const passport = require("passport");
import { Strategy } from "passport-local";
import mongoose from "mongoose";

const LocalStrategy = Strategy;
const User = mongoose.model("User");

passport.use(
  new LocalStrategy(
    {
      usernameField: "user[email]",
      passwordField: "user[password]"
    },
    (email, password, done) => {
      User.findOne({ email: email })
        .then(user => {
          if (!user || !user.validPassword(password)) {
            return done(null, false, {
              errors: { "email or password": "is invalid" }
            });
          }

          return done(null, user);
        })
        .catch(done);
    }
  )
);
