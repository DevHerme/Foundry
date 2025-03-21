// routes/webhookRoutes.js
const express = require('express');
const router = express.Router();
const { handleGitHubWebhook } = require('../controllers/webhookController');

// POST /webhook
router.post('/', handleGitHubWebhook);

module.exports = router;
