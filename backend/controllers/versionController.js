const path = require('path');
const fs = require('fs');

exports.getVersion = (req, res) => {
  const versionPath = path.join(__dirname, '../version.txt');
  const stackPath = path.join(__dirname, '../stack.txt');

  let version = 'unknown';
  let stack = 'unknown';

  if (fs.existsSync(versionPath)) {
    version = fs.readFileSync(versionPath, 'utf8').trim();
  }

  if (fs.existsSync(stackPath)) {
    stack = fs.readFileSync(stackPath, 'utf8').trim();
  }

  res.json({ version, stack });
};
