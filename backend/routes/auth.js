const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validators/authValidator');

router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);

module.exports = router;