const router = require('express').Router();
const api_dir = require('./api/user-ops');

router.use('/api', api_dir);

module.exports = router;