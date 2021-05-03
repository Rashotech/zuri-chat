const router = require('express').Router();

router.use('/', require('./main'));
router.use('/auth', require('./user'));

module.exports = router;