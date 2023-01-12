const express = require('express')
const activateAccount = require('../controllers/users/activateAccount')
const login = require('../controllers/users/login')
const register = require('../controllers/users/register')

const router = express.Router()

router.post('/register', register)
router.post('/activate', activateAccount)
router.post('/login', login)

module.exports = router
