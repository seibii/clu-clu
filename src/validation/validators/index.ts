import { ValidationError } from '../index';
import { presenceValidator } from './precenseValidator';
import { numberValidator } from './numberValidator';
import { emailValidator } from './emailValidator';
import { phoneNumberValidator } from './phoneNumberValidator';
import { nameValidator } from './nameValidator';
import { hiraganaValidator } from './hiraganaValidator';
import { dictionary } from './localization/ja';

export interface Validator {
  email(column: string, value: unknown): ValidationError | null;
  hiragana(column: string, value: unknown): ValidationError | null;
  name(column: string, value: unknown): ValidationError | null;
  number(column: string, value: unknown): ValidationError | null;
  phoneNumber(column: string, value: unknown): ValidationError | null;
  presence(column: string, value: unknown): ValidationError | null;
}

export const Validator: Validator = {
  email: (column: string, value: unknown) => emailValidator(dictionary(column), value),
  hiragana: (column: string, value: unknown) => hiraganaValidator(dictionary(column), value),
  name: (column: string, value: unknown) => nameValidator(dictionary(column), value),
  number: (column: string, value: unknown) => numberValidator(dictionary(column), value),
  phoneNumber: (column: string, value: unknown) => phoneNumberValidator(dictionary(column), value),
  presence: (column: string, value: unknown) => presenceValidator(dictionary(column), value)
};
