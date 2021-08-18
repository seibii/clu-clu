import { ValidationError } from "../index";
import { presenceValidator } from "./precenseValidator";
import { numberValidator } from "./numberValidator";
import { emailValidator } from "./emailValidator";
import { phoneNumberValidator } from "./phoneNumberValidator";
import { nameValidator } from "./nameValidator";
import { hiraganaValidator } from "./hiraganaValidator";
import { dictionary } from "./localization/ja";

export interface Validator {
  email(
    column: string,
    value: unknown,
    displayName?: string
  ): ValidationError | null;
  hiragana(
    column: string,
    value: unknown,
    displayName?: string
  ): ValidationError | null;
  name(
    column: string,
    value: unknown,
    displayName?: string
  ): ValidationError | null;
  number(
    column: string,
    value: unknown,
    displayName?: string
  ): ValidationError | null;
  phoneNumber(
    column: string,
    value: unknown,
    displayName?: string
  ): ValidationError | null;
  presence(
    column: string,
    value: unknown,
    displayName?: string
  ): ValidationError | null;
}

export const Validator: Validator = {
  email: (column: string, value: unknown, displayName?: string) =>
    emailValidator(displayName || dictionary(column), value),
  hiragana: (column: string, value: unknown, displayName?: string) =>
    hiraganaValidator(displayName || dictionary(column), value),
  name: (column: string, value: unknown, displayName?: string) =>
    nameValidator(displayName || dictionary(column), value),
  number: (column: string, value: unknown, displayName?: string) =>
    numberValidator(displayName || dictionary(column), value),
  phoneNumber: (column: string, value: unknown, displayName?: string) =>
    phoneNumberValidator(displayName || dictionary(column), value),
  presence: (column: string, value: unknown, displayName?: string) =>
    presenceValidator(displayName || dictionary(column), value),
};
