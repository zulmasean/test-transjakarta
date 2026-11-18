import { requireEnv } from '../config/env';
import studentJson from './student.json';

function requireMobile(name: string): string {
  const value = requireEnv(name);
  if (!/^\d{10}$/.test(value)) {
    throw new Error(
      `${name} harus tepat 10 digit angka, sekarang "${value}" (${value.length} karakter). Cek file .env atau GitHub Variables.`,
    );
  }
  return value;
}

export const student = {
  ...studentJson,
  firstName: requireEnv('STUDENT_FIRST_NAME'),
  lastName: requireEnv('STUDENT_LAST_NAME'),
  email: requireEnv('STUDENT_EMAIL'),
  mobile: requireMobile('STUDENT_MOBILE'),
  address: requireEnv('STUDENT_ADDRESS'),
};
