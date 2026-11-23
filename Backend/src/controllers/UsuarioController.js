import usuarioService from "../services/UsuarioService.js";
import { successResponse } from "../responses/ApiResponse.js";
import { HttpStatus } from "../enums/HttpStatus.js";
import { parseId } from "../utils/parseId.js";
class UsuarioController {
    getAll(req, res) {
        return successResponse(res, usuarioService.listar(req.query));
    }
    getById(req, res) {
        const usuario = usuarioService.obtenerConHistorial(parseId(req.params.id));
        return successResponse(res, usuario);
    }
    create(req, res) {
        const usuario = usuarioService.crearPersonal(req.body);
        return successResponse(res, usuario, HttpStatus.CREATED);
    }
    cambiarEstado(req, res) {
        const usuario = usuarioService.cambiarEstado(req.usuario, parseId(req.params.id), req.body);
        return successResponse(res, usuario);
    }
}
export default new UsuarioController();
