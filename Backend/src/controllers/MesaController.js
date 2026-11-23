import mesaService from "../services/MesaService.js";
import { successResponse } from "../responses/ApiResponse.js";
import { HttpStatus } from "../enums/HttpStatus.js";
import { parseId } from "../utils/parseId.js";
class MesaController {
    getAll(req, res) {
        return successResponse(res, mesaService.getAll());
    }
    getById(req, res) {
        const mesa = mesaService.getById(parseId(req.params.id));
        return successResponse(res, mesa);
    }
    create(req, res) {
        const mesa = mesaService.create(req.body);
        return successResponse(res, mesa, HttpStatus.CREATED);
    }
    update(req, res) {
        const mesa = mesaService.update(parseId(req.params.id), req.body);
        return successResponse(res, mesa);
    }
    delete(req, res) {
        const mesa = mesaService.delete(parseId(req.params.id));
        return successResponse(res, mesa);
    }
}
export default new MesaController();
