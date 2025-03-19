import { isAddress } from "@dexkit/core/utils/ethers/isAddress";
import { PATTERN_TWO_DIGITS_AFTER_COMMA } from "../constants/validation";
import { ValidatorFunc } from "../types";

export function requiredField(message: string) {
  return (value: string) => {
    return value === undefined ? message : undefined;
  };
}

export function validateDecimal(message: string) {
  return (value: string) => {
    if (!PATTERN_TWO_DIGITS_AFTER_COMMA.test(value)) {
      return message;
    }
  };
}

export function validateAddress(message: string) {
  return (value: string) => {
    if (!isAddress(value)) {
      return message;
    }
  };
}

export function concactValidators(validators: ValidatorFunc[]) {
  return (value: string) => {
    for (let validator of validators) {
      const message = validator(value);

      if (message !== undefined) {
        return message;
      }
    }
  };
}
