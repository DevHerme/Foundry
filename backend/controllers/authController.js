const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/pool'); // Database connection

// User Registration
exports.registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rowCount > 0) {
            return res.status(400).json({ error: 'Email already in use.' });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert User
        await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [
            email,
            hashedPassword,
        ]);

        res.status(201).json({ success: true, message: 'User registered successfully.' });
    } catch (err) {
        console.error('Error during registration:', err.message);
        res.status(500).json({ error: 'Registration failed. Please try again later.' });
    }
};

// User Login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rowCount === 0) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const user = userResult.rows[0];

        // Compare Passwords
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Generate Token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ success: true, token });
    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).json({ error: 'Something went wrong. Please try again later.' });
    }
};
