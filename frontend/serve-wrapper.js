// Ensure dotenv is loaded first
try {
    require('dotenv').config();
} catch (error) {
    console.error('Error loading .env file:', error);
}

const { exec } = require('child_process');

// Safely load PORT from .env or fall back to 3000
const port = process.env.PORT || 3000;

// Log the command for debugging
const command = `npx serve -s build -l ${port}`;
console.log(`Running: ${command}`);

// Execute the serve command
const serveProcess = exec(command);

// Handle output and errors
serveProcess.stdout.on('data', (data) => {
    console.log(data.toString());
});

serveProcess.stderr.on('data', (data) => {
    console.error(data.toString());
});

serveProcess.on('close', (code) => {
    console.log(`Process exited with code ${code}`);
});
