import fs from 'fs';
import path from 'path';

const envFile = path.join(__dirname, '..', '.env');
if (fs.existsSync(envFile)) process.loadEnvFile(envFile);

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Environment variable "${name}" belum diisi. Cek file .env atau GitHub Variables.`);
  return value;
}
