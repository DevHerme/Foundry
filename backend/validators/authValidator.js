const { body } = require('express-validator');

const validateRegistration = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email.')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long.')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter.')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number.')
        .trim(),
];

const validateLogin = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email.')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required.'),
];

module.exports = {
    validateRegistration,
    validateLogin,
};
