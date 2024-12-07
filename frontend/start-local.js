const { exec } = require('child_process');

const server = exec('npm start', { env: { ...process.env, NODE_ENV: 'development' } });

server.stdout.on('data', (data) => {
  console.log(data.toString());
});

server.stderr.on('data', (data) => {
  console.error(data.toString());
});

server.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
});
