const fs = require('fs');
const path = require('path');

exports.getVersion = (req, res) => {
  const versionFilePath = path.resolve(__dirname, '../../version.txt');

  try {
    const stack = fs.readFileSync(versionFilePath, 'utf8').trim();
    return res.status(200).json({ stack });
  } catch (err) {
    console.error('Failed to read version.txt:', err.message);
    return res.status(500).json({ error: 'Could not determine version' });
  }
};
