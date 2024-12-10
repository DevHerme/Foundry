const express = require('express');
const { validateRegistration, validateLogin } = require('../validators/authValidator');
const { registerUser } = require('../controllers/registrationController');
const { loginUser } = require('../controllers/loginController');
const validate = require('../middleware/validate'); // Centralized validation middleware

const router = express.Router();

router.post('/register', validateRegistration, validate, registerUser);
router.post('/login', validateLogin, validate, loginUser);

module.exports = router;
