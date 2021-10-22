const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport')
require('./lib/passport');

const {database} = require('./keys');

// Settings
app.set('views', path.join(__dirname, 'views'))
app.set('view engine','ejs');

// Midlewears
app.use(flash());
app.use(session({
    secret: 'micodigosecreto',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Public files
app.use(express.static(path.join(__dirname, 'public')));

// Global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

// Routes
app.use(require('./routes'));

app.listen(3000, () => {
    console.log('servidor iniciado')
});
