export const emailValidator = (column: string, value: unknown): { message: string } | null => {
  if (!value) return null;
  if (typeof value !== 'string') return null;

  if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
    return { message: 'メールアドレスが正しくありません。' };
  }
  return null;
};
