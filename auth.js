const passport = require('passport');
const User = require('./db');

// Tell passport to use the strategy for our User model
passport.use(User.createStrategy())

// Tell passport to use our User model to serialize/deserialize the user
// This is required in order to store the user in the session.
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

module.exports = passport
