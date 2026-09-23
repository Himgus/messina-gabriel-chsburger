import { BadRequestError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
export const parseId = (valor) => {
    const id = Number(valor);
    if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestError(Messages.INVALID_ID);
    }
    return id;
};
