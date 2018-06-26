const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session')
const User = require('./db');

const app = express();

// Tell passport to use the strategy for our User model
passport.use(User.createStrategy())

// Tell passport to use our User model to serialize/deserialize the user
// This is required in order to store the user in the session.
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Use JSON body parser (for POST requests)
app.use(bodyParser.json())

app.use(passport)

// Create Session
app.use(session({
  secret: 'foobarbat',
  resave: false,
  saveUninitialized: false,
}))

// Initialize passport and connect it to the session
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.get('/', (req, res) => {
  console.log(req.user || '')
  res.send(`You are logged ${req.user ? 'in as '+JSON.stringify(req.user) : 'out'}`)
})

app.post('/register', (req, res) => {
  User.register(new User({ email: req.body.email}), req.body.password, (err) => {
    console.log(err)
    // If registration failed:
    if (err) {
      return res.status(500).send(err.message)
    }

    // Registration was successful. New user now exists in db with hased pw.
    // Log the new user in
    // Authentication returns a function, which we'll store in fn
    const fn = passport.authenticate('local')

    // Call the fn function
    fn(req, res, () => {
      res.redirect('/')
    })
  })
})

app.post('/login', passport.authenticate('local'), (req, res) => {
  // Will only happen if passport.authenticate is successful
  res.redirect('/')
})

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

// Listen
app.listen(5555, () => console.log('Listening on 5555'))
