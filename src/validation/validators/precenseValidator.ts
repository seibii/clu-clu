export const presenceValidator = (column: string, value: unknown): { message: string } | null => {
  if (!value) {
    return { message: `${column}を入力してください。` };
  }
  return null;
};
