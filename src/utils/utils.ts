import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(plainPassword: string, hashPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashPassword);
}

export const base64Decoded = (base64String: string): string | null => {
  try {
    return Buffer.from(base64String, 'base64').toString('utf-8');
  } catch (error) {
    return null;
  }
}

export const decodeBase64 = (base64String: string): string | null => {
  try {
    return atob(base64String);
  } catch (error) {
    return null;
  }
}
