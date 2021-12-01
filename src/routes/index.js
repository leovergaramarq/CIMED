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
    const events = [
        {
            id: '01',
            place: 'Cra 12 # 8B - 19',
            doctor: {
                name: 'Jaime Altozano',
                esp: 'Otorrinolaringólogo',
            },
            start: new Date(2021, 12-1, 19, 16, 00),
            end: new Date(2021, 12-1, 19, 16, 30),
        },
        {
            id: '02',
            place: 'Cra 6 # 61 - 22',
            doctor: {
                name: 'Mario Mandzukic',
                esp: 'Pediatra',
            },
            start: new Date(2021, 12-1, 19, 11, 30).toString(),
            end: new Date(2021, 12-1, 19, 12, 30).toString(),
        },
        {
            id: '03',
            place: 'Cra 6A # 54 - 32',
            doctor: {
                name: 'José Guardiola',
                esp: 'Cirujano',
            },
            start: new Date(2021, 12-1, 11, 6, 30).toString(),
            end: new Date(2021, 12-1, 11, 8, 30).toString(),
        },
        {
            id: '04',
            place: 'Cra 46 # 9 - 16',
            doctor: {
                name: 'Miriam Campos',
                esp: 'Ortopedista',
            },
            start: new Date(2021, 12-1, 31, 23, 30).toString(),
            end: new Date(2021, 12-1, 31, 23, 45).toString(),
        },
    ]
    events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    
    events.forEach(e => {
        e.date = new Date(e.start).toLocaleDateString();
        e.start = new Date(e.start).toLocaleTimeString();
        e.end = new Date(e.end).toLocaleTimeString();
    })

    res.render('userSession/ncita', {events});
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
