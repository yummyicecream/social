"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lengthValidationMessage = void 0;
const lengthValidationMessage = (args) => {
    if (args.constraints.length === 2) {
        return `${args.property}_must_be_${args.constraints[0]}~${args.constraints[1]}`;
    }
    else {
        return `${args.property}_must_be_at_least ${args.constraints[0]}`;
    }
};
exports.lengthValidationMessage = lengthValidationMessage;
//# sourceMappingURL=validation-message.js.map