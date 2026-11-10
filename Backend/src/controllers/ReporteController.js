import reporteService from "../services/ReporteService.js";
import { successResponse } from "../responses/ApiResponse.js";
class ReporteController {
    ocupacion(req, res) {
        return successResponse(res, reporteService.ocupacion());
    }
}
export default new ReporteController();
