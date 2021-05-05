const router = require('express').Router();

router.use('/', require('./main'));
router.use('/', require('./user'));

module.exports = router;