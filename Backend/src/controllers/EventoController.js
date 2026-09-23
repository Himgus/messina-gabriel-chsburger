import eventoService from "../services/EventoService.js";
import { successResponse } from "../responses/ApiResponse.js";
import { HttpStatus } from "../enums/HttpStatus.js";
import { parseId } from "../utils/parseId.js";
class EventoController {
    getAll(req, res) {
        const eventos = eventoService.getAll();
        return successResponse(res, eventos);
    }
    getById(req, res) {
        const id = parseId(req.params.id);
        const evento = eventoService.getById(id);
        return successResponse(res, evento);
    }
    create(req, res) {
        const evento = eventoService.create(req.body);
        return successResponse(res, evento, HttpStatus.CREATED);
    }
    update(req, res) {
        const id = parseId(req.params.id);
        const evento = eventoService.update(id, req.body);
        return successResponse(res, evento);
    }
    delete(req, res) {
        const id = parseId(req.params.id);
        const evento = eventoService.delete(id);
        return successResponse(res, evento);
    }
}
export default new EventoController();
