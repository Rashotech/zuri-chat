const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware/auth');

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/chat', requireLogin, (req, res) => {
    payload = {
        "pageTitle": "Chat",
        "userLoggedIn": req.session.user
    }
    res.render('chat', payload);
});

router.get('/logout', (req, res, next) => {
    if(req.session) {
        req.session.destroy(() => {
            res.redirect('/login')
        });
    }
});

module.exports = router;