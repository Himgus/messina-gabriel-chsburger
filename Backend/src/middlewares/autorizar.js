import { ForbiddenError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
export const autorizar = (...roles) => (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
        throw new ForbiddenError(Messages.ACCESO_DENEGADO);
    }
    next();
};
