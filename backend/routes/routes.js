const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const webhookRoutes = require('./webhookRoutes');
const versionRoutes = require('./versionRoutes');

router.use('/auth', authRoutes);
router.use('/webhook', webhookRoutes);
router.use('/', versionRoutes);
router.use('/api', versionRoutes);

module.exports = router;
