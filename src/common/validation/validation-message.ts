import { ValidationArguments } from 'class-validator';

export const lengthValidationMessage = (args: ValidationArguments) => {
  if (args.constraints.length === 2) {
    return `${args.property}_must_be_${args.constraints[0]}~${args.constraints[1]}`;
  } else {
    return `${args.property}_must_be_at_least ${args.constraints[0]}`;
  }
};
