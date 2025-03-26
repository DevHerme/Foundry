// backend/routes/versionRoutes.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/version', (req, res) => {
  const versionPath = path.join(__dirname, '..', 'version.txt');
  const stackPath = path.join(__dirname, '..', 'stack.txt');

  try {
    const version = fs.readFileSync(versionPath, 'utf8').trim();
    const stack = fs.readFileSync(stackPath, 'utf8').trim();
    res.json({ version, stack });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to read version or stack file' });
  }
});

module.exports = router;
