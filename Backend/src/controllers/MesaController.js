import mesaService from "../services/MesaService.js";
import { successResponse } from "../responses/ApiResponse.js";
class MesaController {
    getAll(req, res) {
        return successResponse(res, mesaService.getAll());
    }
}
export default new MesaController();
