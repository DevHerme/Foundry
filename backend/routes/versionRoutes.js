const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const versionPath = path.resolve(__dirname, '../../version.txt');
const stackPath = path.resolve(__dirname, '../../stack.txt');

const version = fs.existsSync(versionPath) ? fs.readFileSync(versionPath, 'utf8').trim() : 'unknown';
const stack = fs.existsSync(stackPath) ? fs.readFileSync(stackPath, 'utf8').trim() : 'unknown';

router.get('/version', (req, res) => {
  res.status(200).json({ version, stack });
});

module.exports = router;
