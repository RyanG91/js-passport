const mongoose = require('mongoose');
const passport = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost/express-mongo-passport');

// Create schema called user_schema
const user_schema = new mongoose.Schema({

});

// Attach passport to the schema
user_schema.plugin(passport, { usernameField: 'email' });

console.log(user_schema)

// Create a User model from the user_schema schema
module.exports = mongoose.model('User', user_schema)
