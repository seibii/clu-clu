export const nameValidator = (
  displayName: string,
  value: unknown
): { message: string } | null => {
  if (!value) return null;
  if (typeof value !== "string") return null;

  if (!/^[^@]+$/.test(value)) {
    return { message: `${displayName}に記号は入力できません。` };
  }
  return null;
};
