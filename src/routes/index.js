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

router.post('/admin',isLoggedIn,(req,res)=>{
    const {name, date, doctor} = req.body;
    let consulta ="SELECT c.id, u.fullname as patientName, d.fullname as doctorName, c.causa, c.fechaCita FROM citas c JOIN users u ON	u.id=c.pacientID ";
    if (name) {
        consulta+="and u.username=? ";
    }
    consulta+="JOIN doctor d ON c.doctorID=d.id ";
    if (doctor) {
        consulta+="and d.fullname=? ";
    }
    if(date){
        consulta+="WHERE DATE(c.fechaCita)=?";
    }
    pool.query(consulta, [name, date, doctor], (err, rows, fields) => {
        res.render('admin/filter', {citas: rows });
    });

});

router.get('/miscitas', isLoggedIn, (req, res) => {

    pool.query('SELECT c.*, d.fullname as doctorName FROM citas c JOIN doctor d ON d.id=c.doctorID and c.pacientID=?', [req.user.id], (err, rows, fields) => {
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
    const id = req.user.id;
    const data = {
        id,
        edad,
        correo, 
        celular, 
        direccion, 
        estrato, 
        localizacion, 
        eps, 
        cedula
    };
    pool.query('INSERT INTO data SET ?', [data], (err, result, fields) => {
        if(err) throw err;
        res.redirect('/profile');
    });
    //req.flash('success', 'Link saved successfully');

    

});


router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/signin');
});

router.get('/*', (req, res) => {
    res.render('404');
});
module.exports = router;
