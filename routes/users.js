var express = require('express');
var GoogleAuth = require('google-auth-library');
var router = express.Router();
var mariadb = require('../db/db-connect');
const bcrypt = require('bcryptjs');
// const CLIENT_ID = '309978492743-ereano57g6etdgrk4ebno3tge401fjt1.apps.googleusercontent.com';
const CLIENT_ID = '214746217802-jg3f9mu6oflodrvhott42cjj7ij6palc.apps.googleusercontent.com';

// Middleware function for any type of HTTP request to the /users/login path.
// This function will be executed everytime there is a HTTP request to the /user/login path.
// This function checks the users credentials
router.use('/login', function(req, res, next) {
    var email = req.body.user.femail;
    var pass = req.body.user.fpwd;

    // Check user credentials
    mariadb.query(`SELECT id, username, password FROM users WHERE username="${email}"`, function(err, foundUser) {
        if (err) {
            throw err;
        }

        if (foundUser.length > 0) {
            return bcrypt.compare(pass, foundUser[0].password, function(err, result) {
                if (result) {
                    delete foundUser[0].password;
                    req.session.user = foundUser[0];
                    // console.log(req.session.user);
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

// Middleware function to verify googleID
router.use('/verify_token', function(req, res, next) {
    var auth = new GoogleAuth();
    var client = new auth.OAuth2(CLIENT_ID, '', '');
    var token = req.body.idtoken;

    client.verifyIdToken(token, CLIENT_ID, function(e, login) {
        var payload = login.getPayload();
        var userid = payload.sub;
        var email = payload.email;

        // Check if the user has already signed up
        mariadb.query(`SELECT id, username, googleID FROM users WHERE username="${email}"`, function(err, user) {
            if (err) {
                throw err;
            }

            // User already exist in the database(i.e. user has already signed up) check credentials
            if (user.length > 0) {
                bcrypt.compare(userid, user[0].googleID, function(err, result) {
                    if (result) {
                        delete user[0].googleID;
                        req.session.user = user[0];
                        return next();
                    }
                    res.send('Invalid googleID');
                });
            } else {
                // Add user into the database
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(userid, salt, function(err, hash) {
                        mariadb.query(`INSERT INTO users(username, password, googleID) VALUES ("${email}", "google-sign-in", "${hash}")`, function(err, result) {
                            if (err) {
                                throw err;
                            }

                            req.session.user = {
                                id: result.info.insertId,
                                username: email
                            };
                            return next();
                        });
                    });
                });
            }
        });
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

// GOOGLE SIGN IN
router.post('/verify_token', function(req,res) {
    res.status(200).send();
});

// SIGNOUT
router.get('/signout', function(req, res) {
    delete req.session.user;
    res.redirect('/');
});

module.exports = router;
