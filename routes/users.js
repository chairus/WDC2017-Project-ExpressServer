var express = require('express');
var router = express.Router();
var mariadb = require('../db/db-connect');
const bcrypt = require('bcryptjs');

// Middleware function for any type of HTTP request to the /users/login path.
// This function will be executed everytime there is a HTTP request to the /user/login path.
router.use('/login', function(req, res, next) {
    var email = req.body.user.femail;
    var pass = req.body.user.fpwd;

    // Check user credentials
    mariadb.query(`SELECT id, password FROM users WHERE username="${email}"`, function(err, user) {
        if (err) {
            throw err;
        }

        if (user.length > 0) {
            return bcrypt.compare(pass, user[0].password, function(err, result) {
                if (result) {
                    req.body.user.id = user[0].id;
                    req.session.user = req.body.user;
                    return next();
                }
                req.flash('warning', 'Wrong password');
                res.redirect('/');
            });
        }
        req.flash('warning', 'User not found');
        res.redirect('/');
    });
});

// SIGNUP - Create a new account
router.post('/signup', function(req, res) {
    var newUser = req.body.user;

    // Check if the given passwords are the same
    if (newUser.fpwd === newUser.fpwd2) {
        mariadb.query(`SELECT * FROM users WHERE username="${newUser.femail}"`, function(err, userExist) {
            if (err) {
                throw err;
            }
            // Check if the given email already exists
            if (userExist.length === 0) {
                // Encrypt password and store into DB
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.fpwd, salt, function(err, hash) {
                        mariadb.query(`INSERT INTO users(username, password) VALUES ("${newUser.femail}", "${hash}")`, function(err, result) {
                            if (err) {
                                throw err;
                            }
                            req.flash('success', 'Successfully created account');
                            res.redirect('/');
                        });
                    });
                });
            } else {
                req.flash('warning', 'Email address already exist. Use a different email address');
                res.redirect('/create.html');
            }
        });
    } else {
        req.flash('warning', 'Password must be the same');
        res.redirect('/create.html');
    }
});

// LOGIN
router.post('/login', function(req, res) {
    res.redirect('/homepage.html');
});

// SIGNOUT
router.get('/signout', function(req, res) {
    delete req.session.user;
    res.redirect('/');
});

module.exports = router;
