import { parsePhoneNumber } from "libphonenumber-js";

const errorMessage = { message: "電話番号が不正です。" };

export const phoneNumberValidator = (
  column: string,
  value: unknown
): { message: string } | null => {
  if (!value) return null;
  if (typeof value !== "string") return null;
  try {
    const phoneNumber = parsePhoneNumber(value, "JP");
    if (phoneNumber) {
      if (phoneNumber.country !== "JP" || !phoneNumber.isValid())
        return errorMessage;
    }
    return null;
  } catch {
    return errorMessage;
  }
};
