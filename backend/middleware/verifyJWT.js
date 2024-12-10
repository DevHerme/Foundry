const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) return res.sendStatus(403); // Invalid token
        req.userId = decoded.userId; // Attach userId to request
        next();
    });
}
