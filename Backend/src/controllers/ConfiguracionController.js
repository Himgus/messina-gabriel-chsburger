import configuracionService from "../services/ConfiguracionService.js";
import { successResponse } from "../responses/ApiResponse.js";
class ConfiguracionController {
    get(req, res) {
        return successResponse(res, configuracionService.obtener());
    }
    update(req, res) {
        const configuracion = configuracionService.actualizar(req.body);
        return successResponse(res, configuracion);
    }
}
export default new ConfiguracionController();
