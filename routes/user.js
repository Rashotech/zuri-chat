const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/UserModel');

router.get('/register', (req, res, next) => {
    return res.render('register')
});

router.post('/register', async (req, res, next) => {
    const { fullName, username, password } = req.body;
    if (fullName && username && password) {
        var user = await User.findOne({ username })
        .catch((error) => {
            console.log(error);
            return res.render("register", {
                errors: "Something went wrong"
            });
        });

        if(user === null) {
            // No User Found
            var data = req.body;
            data.password = await bcrypt.hash(password, 10);
            User.create(data).then((user) => {
                // res.render("login", {"message": "Registration Successful!. Login Now!"})
                req.session.user = user;
                return res.redirect('/');
            })
        } else {
            if(username === user.username) {
                return res.render("register", {
                    errors: "Username already in Use"
                });
            }
        }
    } else {
        res.render("register",{
            errors: "Make sure each field has a valid value"
        });
    };
});

router.get('/login', (req, res, next) => {
    return res.render('login')
});

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    if (username &&  password) {
        var user = await User.findOne({ username: username })
        .catch((error) => {
            console.log(error);
            return res.render("login", {
                errors: 'Something went wrong'
            });
        });

        if(user !== null) {
            var result = await bcrypt.compare(password, user.password);

            if (result === true) {
                req.session.user = user;
                return res.redirect('/');
            }
    
        }

        return res.render("login", {
            errors: "Login credentials incorrect"
        });
    } 
    
    res.render("login",{
        errors: "Make sure each field has a valid value"
    });
});

module.exports = router;