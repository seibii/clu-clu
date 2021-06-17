import { notEmpty } from '../utilities/extentions';
import { Validator } from './validators';

export interface Validation {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  message: string;
}

export type ValidationColumn<K> = { [V in keyof K]?: ValidationType };

interface ValidationType {
  types: ('email' | 'hiragana' | 'name' | 'number' | 'phoneNumber' | 'presence')[];
}

export const validates = <S>(formState: S, validationColumns: ValidationColumn<S>): Validation => {
  const errors = Object.entries(validationColumns)
    .map(([key, value]) => validators(value as ValidationType, key, formState[key as keyof S]))
    .reduce((acc, val) => acc.concat(val), []);

  const isValid = !errors.length;

  return { isValid, errors };
};

const validators = (validationTypes: ValidationType, column: string, value: unknown): ValidationError[] =>
  Object.values(validationTypes.types)
    .map((type) => Validator[type](column, value))
    .filter(notEmpty);
