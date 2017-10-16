// Modules
const dotenv = require('dotenv').config();
const express = require('express');
const validator = require('express-validator');
const session = require('express-session');
const flash = require('express-flash');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const passport = require('passport');

// API keys and Passport configuration (user session)
const passportConfig = require('./config/passport');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

// Routes
const staticController = require('./controller/static');

// Express Server
const app = express();

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());

// Express Add-ons
app.use(validator());
app.use(flash());

// OAuth
app.get('/login/google', passport.authenticate('google'));
app.get('/login/google/return',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) { res.redirect(req.session.returnTo || '/'); }
);

app.use('/bower_components', express.static('bower_components'));

// View Engine
const hbs = exphbs.create({
  defaultLayout: 'layouts.hbs',
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Routes for CSS, JS etc.
app.use(express.static(path.join(__dirname, '/public'), { redirect: false }));


//MongoDB connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});

// Express Config
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true,
    clear_interval: 3600
  })
}));

// Static Pages
app.get('/', staticController.getHome);
app.get('/login', staticController.getSignUp);
app.post('/', staticController.contactMe);


// Local Machine Testing and HTTP
http.createServer(app).listen(process.env.PORT || 8000);
console.log('Server listening on 8000');
