const router = require('express').Router();
const { getUser, editUser } = require('../controllers/users');
const { validateUser } = require('../utils/validation');

router.get('/me', getUser);
router.patch('/me', validateUser, editUser);

module.exports = router;
