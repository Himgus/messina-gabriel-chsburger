import authService from "../services/AuthService.js";
import { UnauthorizedError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
export const autenticar = (req, res, next) => {
    const [tipo, token] = (req.headers.authorization ?? "").split(" ");
    if (tipo !== "Bearer" || !token) {
        throw new UnauthorizedError(Messages.NO_AUTENTICADO);
    }
    req.usuario = authService.verificarToken(token);
    next();
};
