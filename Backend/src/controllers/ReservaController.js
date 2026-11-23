import reservaService from "../services/ReservaService.js";
import { successResponse } from "../responses/ApiResponse.js";
import { HttpStatus } from "../enums/HttpStatus.js";
import { parseId } from "../utils/parseId.js";
class ReservaController {
    getAll(req, res) {
        const reservas = reservaService.listar(req.query);
        return successResponse(res, reservas);
    }
    getMias(req, res) {
        const reservas = reservaService.listarDeUsuario(req.usuario.id);
        return successResponse(res, reservas);
    }
    getById(req, res) {
        const reserva = reservaService.obtener(req.usuario, parseId(req.params.id));
        return successResponse(res, reserva);
    }
    create(req, res) {
        const reserva = reservaService.crear(req.usuario, req.body);
        return successResponse(res, reserva, HttpStatus.CREATED);
    }
    update(req, res) {
        const reserva = reservaService.modificar(req.usuario, parseId(req.params.id), req.body);
        return successResponse(res, reserva);
    }
    cancelar(req, res) {
        const reserva = reservaService.cancelar(req.usuario, parseId(req.params.id), req.body);
        return successResponse(res, reserva);
    }
    registrarSenia(req, res) {
        const reserva = reservaService.registrarSenia(req.usuario, parseId(req.params.id));
        return successResponse(res, reserva);
    }
    hacerCheckIn(req, res) {
        const reserva = reservaService.hacerCheckIn(req.usuario, parseId(req.params.id));
        return successResponse(res, reserva);
    }
    finalizar(req, res) {
        const reserva = reservaService.finalizar(req.usuario, parseId(req.params.id));
        return successResponse(res, reserva);
    }
    marcarAusente(req, res) {
        const reserva = reservaService.marcarAusente(req.usuario, parseId(req.params.id));
        return successResponse(res, reserva);
    }
    asignarMesa(req, res) {
        const reserva = reservaService.asignarMesa(req.usuario, parseId(req.params.id), req.body);
        return successResponse(res, reserva);
    }
}
export default new ReservaController();
