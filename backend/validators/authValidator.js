const { body } = require('express-validator');

exports.registerValidation = [
    body('name').notEmpty().withMessage('Introduzca su nombre'),
    body('surname').notEmpty().withMessage('Introduzca sus apellidos'),
    body('email').isEmail().withMessage('Correo electrónico inválido'),
    body('password')
        .isLength({ min: 8 }).withMessage('Debe tener mínimo 8 caracteres')
        .matches(/[A-Z]/).withMessage('Debe contener una mayúscula')
        .matches(/[a-z]/).withMessage('Debe contener una minúscula')
        .matches(/\d/).withMessage('Debe contener un número')
        .matches(/[^A-Za-z0-9]/).withMessage('Debe tener un carácter especial')
];

exports.loginValidation = [
    body('email').isEmail().withMessage('Correo electrónico inválido'),
    body('password').notEmpty().withMessage('Introduzca su contraseña')
];