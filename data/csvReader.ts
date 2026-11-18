import fs from 'fs';
import path from 'path';

export function readCsv(fileName: string): Record<string, string>[] {
  const text = fs.readFileSync(path.join(__dirname, fileName), 'utf-8');
  const [header, ...rows] = text.trim().split(/\r?\n/).map((line) => line.trim());
  const keys = header.split(',');

  return rows.map((row) => {
    const values = row.split(',');
    return Object.fromEntries(keys.map((key, i) => [key, values[i].trim()]));
  });
}
