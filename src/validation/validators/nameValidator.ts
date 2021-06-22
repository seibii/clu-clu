export const nameValidator = (
  column: string,
  value: unknown
): { message: string } | null => {
  if (!value) return null;
  if (typeof value !== "string") return null;

  if (!/^[^@]+$/.test(value)) {
    return { message: `${column}は記号は入力できません。` };
  }
  return null;
};
