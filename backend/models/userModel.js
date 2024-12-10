const pool = require('../config/pool');

async function findUserByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
}

async function createUser(email, passwordHash) {
    const result = await pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
        [email, passwordHash]
    );
    return result.rows[0];
}

module.exports = { findUserByEmail, createUser };
