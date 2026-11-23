import authService from "../services/AuthService.js";
import usuarioService from "../services/UsuarioService.js";
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
        return successResponse(res, usuarioService.sinContrasena(req.usuario));
    }
    eliminarCuenta(req, res) {
        const resultado = usuarioService.eliminarCuenta(req.usuario, req.body);
        return successResponse(res, resultado);
    }
    actualizarPerfil(req, res) {
        const usuario = usuarioService.actualizarPerfil(req.usuario, req.body);
        return successResponse(res, usuario);
    }
}
export default new AuthController();
