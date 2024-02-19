import { ValidationArguments } from 'class-validator';

export const lengthValidationMessage = (args: ValidationArguments) => {
  if (args.constraints.length === 2) {
    return `${args.property}은 ${args.constraints[0]}~${args.constraints[1]}글자를 입력 해주세요!`;
  } else {
    return `${args.property}는 최소 ${args.constraints[0]}글자를 입력 해주세요!`;
  }
};
