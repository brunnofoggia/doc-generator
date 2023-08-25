import { DocGeneratorErrorType } from '../types/error';

export const error = (code: DocGeneratorErrorType) => {
    throw new Error(getError(code));
};

export const getError = (code: DocGeneratorErrorType) => {
    return code + '';
};
