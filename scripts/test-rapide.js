import { spawn } from 'node:child_process';

const enfant = spawn(process.execPath, ['--test', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, ESGI_SANS_COMPILATION: '1' },
});

enfant.on('exit', (code, signal) => {
  process.exitCode = signal ? 1 : (code ?? 1);
});
