import bcrypt from 'bcrypt';
import { TokenInfo } from './auth.types';

export const hashingPassword = async (password: string) => {

  const salt = await bcrypt.genSalt();

  return await bcrypt.hash(password, salt);
};

export function isTokenInfo(obj: any): obj is TokenInfo {
  return typeof obj === 'object' && obj !== null && typeof obj.userId === 'number';
}
