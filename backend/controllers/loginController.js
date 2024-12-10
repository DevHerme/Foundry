const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/pool'); // Database pool connection

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ success: true, token });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
