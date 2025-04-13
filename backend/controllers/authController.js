const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const pool = require('../models/db');

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("❌ Invalid register request payload.");
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, surname, email, password } = req.body;
    console.log("➡ Register request received:", { name, surname, email });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("🔐 Password hashed successfully.");

        await pool.query(
            'INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)',
            [name, surname, email, hashedPassword]
        );

        console.log("✅ User inserted into database.");
        res.status(201).json({ message: 'Successfully registered user.' });
    } catch (err) {
        console.error("❌ Error during register:", err);

        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                errors: [{ path: 'email', msg: 'Email is already registered' }]
            });
        }

        res.status(500).json({ errors: [{ path: 'server', msg: 'Error registering user' }] });
    }
};

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        console.log("➡ Querying database...");
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        console.log("🔍 Search results:", rows);
        const user = rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({
                errors: [{ path: 'server', msg: 'Correo o contraseña incorrectos' }]
            });
        }

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
        console.error("❌ Error durante login:", err);
        res.status(500).json({ errors: [{ path: 'server', msg: 'Error interno del servidor' }] });
    }
};