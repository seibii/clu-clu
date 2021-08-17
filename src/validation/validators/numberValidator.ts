export const numberValidator = (
  displayName: string,
  value: unknown
): { message: string } | null => {
  if (!value) return null;
  if (typeof value !== "string") return null;

  if (!/^[0-9]+$/.test(value)) {
    return { message: `${displayName}は数値で入力してください。` };
  }
  return null;
};
