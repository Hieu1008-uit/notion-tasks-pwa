import { spawn } from 'child_process';

console.log('🚀 Starting Tasks Fullstack System (Backend + Vite Client)...');

const server = spawn('npx', ['tsx', 'server/index.ts'], { stdio: 'inherit', shell: true });
const client = spawn('npx', ['vite', '--host'], { stdio: 'inherit', shell: true });

process.on('SIGINT', () => {
  server.kill();
  client.kill();
  process.exit(0);
});

process.on('exit', () => {
  server.kill();
  client.kill();
});
