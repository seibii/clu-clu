import { Validation } from "./index";

export function createMockValidation(isValid: boolean): Validation {
  return isValid
    ? {
        isValid: isValid,
        errors: [],
      }
    : {
        isValid: isValid,
        errors: [
          {
            message: "error message",
            column: "name",
          },
        ],
      };
}
