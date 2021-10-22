const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');


passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    pool.query('SELECT * FROM users WHERE username = ?', [username], async (err, rows, fields) => {
        if (err) console.log(err); // En caso de error, resolvemos la Promise con error
        if(rows.length > 0) {
            const user = rows[0];
            const validPassword = await helpers.matchPassword(password, user.password);
            if (validPassword) {
                done(null, user, req.flash('success', 'Welcome ' + user.username));
            }else {
                done(null, false, req.flash('message', 'Incorrect password'));
            }

        } else {
            return done(null, false, req.flash('message', 'The Username does not exists'));
        }
    });  
}));

passport.use('local.signup', new LocalStrategy({
    usenameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { fullname } = req.body;
    const newUser = {
        username,
        password,
        fullname
    };
    newUser.password = await helpers.encryptPassword(password);
    pool.query('INSERT INTO users SET ?',[newUser], (err, rows, fields) => {
        if (err) console.log(err); // En caso de error, resolvemos la Promise con error
        newUser.id = rows.insertId;
        return done(null,newUser);
    });   
    
}));



passport.serializeUser((usr, done) => {
    done(null, usr.id);
});

passport.deserializeUser(async (id, done) => {
    pool.query('SELECT * FROM users WHERE id = ?',[id], (err, rows, fields) => {
        if (err) console.log(err); // En caso de error, resolvemos la Promise con error
        done(null, rows[0]);
    });   
});