export const presenceValidator = (
  displayName: string,
  value: unknown
): { message: string } | null => {
  if (!value) {
    return { message: `${displayName}を入力してください。` };
  }
  return null;
};
