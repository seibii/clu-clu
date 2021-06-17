export const hiraganaValidator = (column: string, value: unknown): { message: string } | null => {
  if (!value) return null;
  if (typeof value !== 'string') return null;

  // eslint-disable-next-line no-irregular-whitespace
  if (!/^[ぁ-んー－ 　]+$/.test(value)) {
    return { message: `${column}はひらがなのみで入力して下さい。` };
  }
  return null;
};
