import * as bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return await bcrypt.hash(password, salt);
};
export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
