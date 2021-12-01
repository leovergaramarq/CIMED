const express = require('express');
const router = express.Router();
const passport = require('passport');
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');


router.get('/', (req, res) => {
    res.render('index');
});

router.get('/profile', isLoggedIn, (req, res) => {

    pool.query('SELECT * FROM data where id = ?', [req.user.id], (err, rows, fields) => {
        if(rows.length > 0) {
            pool.query('SELECT * FROM data WHERE id= ?', [req.user.id],(err, rows, fields) => {
                if (err) reject(err); // En caso de error, resolvemos la Promise con error
                console.log('leonardo')
                res.render('userSession/profile',{data: rows[0]});
            });
        } else {
            res.redirect('/primering')
        }

    });


});

router.get('/miscitas', isLoggedIn, (req, res) => {

    pool.query('SELECT * FROM citas WHERE id = ?', [req.user.id], (err, rows, fields) => {
        res.render('userSession/miscitas', {citas: rows });
    });
});

router.get('/ncita', isLoggedIn, (req, res) => {

    res.render('userSession/ncita');
});

router.get('/admin', isLoggedIn, (req, res) => {

    res.render('admin/filter');
});


router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/login');
});

router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
});

router.get('/primering', isLoggedIn, (req, res) => {

    pool.query('SELECT * FROM data where id = ?', [req.user.id], (err, rows, fields) => {

        if(false) {
            res.redirect('/profile');
        } else {
            res.render('userSession/primering');
        }

    });

});




// agregados


router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
}));


router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin',{
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res,next);
});

router.post('/primering', isLoggedIn, async(req, res) => {
    const { edad, correo, celular, direccion, estrato, localizacion, eps, cedula } = req.body;
    const username = req.user.username;
    const id = req.user.id;
    const data = {
        id,
        username,
        edad,
        correo, 
        celular, 
        direccion, 
        estrato, 
        localizacion, 
        eps, 
        cedula
    };
    pool.query('INSERT INTO data set ?', [data], () => {
        res.redirect('/profile');
    });
    //req.flash('success', 'Link saved successfully');

    

});


router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/signin');
});

router.get('/nueva-cita', isLoggedIn, (req, res) => {
    res.render('userSession/nuevaCita');
});

router.get('/*', (req, res) => {
    res.render('404');
});

module.exports = router;
