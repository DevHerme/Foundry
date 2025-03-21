// controllers/webhookController.js
const { exec } = require('child_process');
// For advanced security, you can also require('crypto') and verify GitHub's HMAC signature.

exports.handleGitHubWebhook = async (req, res) => {
  try {
    const secret = process.env.WEBHOOK_SECRET; 
    if (!secret) {
      console.error('WEBHOOK_SECRET is not set.');
      return res.status(500).send('Server misconfiguration');
    }

    // Example: Check a custom header or request body for the secret
    const receivedSecret = req.headers['x-webhook-secret'] || req.body.secret;
    if (receivedSecret !== secret) {
      console.error('Invalid secret key received.');
      return res.status(403).send('Invalid secret key');
    }

    console.log('Valid webhook received:', req.body);

    // Trigger your deployment script (update path as needed)
    exec('/path/to/deployment/script.sh', (error, stdout, stderr) => {
      if (error) {
        console.error('Deployment script error:', error);
        return res.status(500).send('Deployment failed');
      }
      console.log('Deployment script output:', stdout);
      res.status(200).send('Deployment triggered successfully');
    });
  } catch (err) {
    console.error('Error in handleGitHubWebhook:', err);
    res.status(500).send('Server error');
  }
};
