const bcrypt = require('bcrypt');
const pool = require('../config/pool'); // Database pool connection

exports.registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user already exists
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user
        await pool.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2)',
            [email, hashedPassword]
        );

        res.status(201).json({ success: true, message: 'Registration successful!' });
    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
