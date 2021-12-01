require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const MySQLStore = require('express-mysql-session');
require('./lib/passport');
const handlebars = require('express-handlebars');

// Settings
app.set('views', path.join(__dirname, 'views'))
app.set('view engine','.hbs');
app.engine('.hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    extname: '.hbs',
    defaultLayout: 'main'
}))

// Middlewares
app.use(flash());
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
} 
)
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

app.listen(process.env.PORT, () => {
    console.log('servidor iniciado')
});
