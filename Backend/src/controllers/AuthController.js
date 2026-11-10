import authService from "../services/AuthService.js";
import { successResponse } from "../responses/ApiResponse.js";
import { HttpStatus } from "../enums/HttpStatus.js";
class AuthController {
    registrar(req, res) {
        const sesion = authService.registrar(req.body);
        return successResponse(res, sesion, HttpStatus.CREATED);
    }
    iniciarSesion(req, res) {
        const sesion = authService.iniciarSesion(req.body);
        return successResponse(res, sesion);
    }
    perfil(req, res) {
        return successResponse(res, authService.sinContrasena(req.usuario));
    }
}
export default new AuthController();
