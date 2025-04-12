const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const { createPool } = require('mysql2/promise');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'app',
    password: 'app',
    database: 'app'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to database.');
    }
});

const app = express();
app.use(cors());
app.use(express.json());
const promisePool = createPool({
    host: 'localhost',
    user: 'app',
    password: 'app',
    database: 'app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.post('/register', [
    body('name').notEmpty().withMessage('Introduzca su nombre'),
    body('surname').notEmpty().withMessage('Introduzca sus apellidos'),
    body('email').isEmail().withMessage('Introduzca un correo electrónico válido'),
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/[A-Z]/).withMessage('Debe tener al menos una mayúscula')
        .matches(/[a-z]/).withMessage('Debe tener al menos una minúscula')
        .matches(/\d/).withMessage('Debe tener al menos un número')
        .matches(/[^A-Za-z0-9]/).withMessage('Debe tener al menos un carácter especial')
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log("Incorrect register request.");
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, surname, email, password } = req.body;
    console.log('Register request: ', { name, surname, email, password });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await promisePool.query(
            'INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)',
            [name, surname, email, hashedPassword]
        );
        console.log('Usuario registrado: ', { name, surname, email });
        res.status(201).json({ message: 'Successfully registered user.' });
    } catch (err) {
        console.error("Error trying to register user: ", err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                errors: [{ path: 'email', msg: 'El correo ya está registrado' }]
            });
        }
        res.status(500).json({
            errors: [{ path: 'server', msg: 'Error registrando usuario' }]
        });
    }
});

app.post('/login', [
    body('email').isEmail().withMessage('Introduzca un correo electrónico válido'),
    body('password').notEmpty().withMessage('Introduzca su contraseña')
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log("Incorrect login request.");
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;
    console.log('Login request: ', { email, password });

    try {
        const [rows] = await promisePool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (rows.length === 0 || !passwordMatch) {
            return res.status(400).json({
                errors: [{ path: 'server', msg: 'El correo electrónico o la contraseña no son correctos' }]
            });
        }
        console.log('Login exitoso: ', user.email);
        res.status(200).json({
            message: 'Usuario iniciado sesión',
            user: {
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email
            }
        });

    } catch (err) {
        console.error("Error during login: ", err);
        res.status(500).json({
            errors: [{ path: 'server', msg: 'Error interno del servidor' }]
        });
    }

});

app.listen(3000, () => {
    console.log('Servidor backend escuchando en http://192.168.0.22:3000');
});