import productoService from "../services/ProductoService.js";
import { successResponse } from "../responses/ApiResponse.js";
import { HttpStatus } from "../enums/HttpStatus.js";
import { parseId } from "../utils/parseId.js";
class ProductoController {
    getAll(req, res) {
        return successResponse(res, productoService.getAll(req.query));
    }
    getById(req, res) {
        const producto = productoService.getById(parseId(req.params.id));
        return successResponse(res, producto);
    }
    create(req, res) {
        const producto = productoService.create(req.body);
        return successResponse(res, producto, HttpStatus.CREATED);
    }
    update(req, res) {
        const producto = productoService.update(parseId(req.params.id), req.body);
        return successResponse(res, producto);
    }
    delete(req, res) {
        const producto = productoService.delete(parseId(req.params.id));
        return successResponse(res, producto);
    }
    subirImagen(req, res) {
        const imagen = productoService.registrarImagen(req.file);
        return successResponse(res, imagen, HttpStatus.CREATED);
    }
}
export default new ProductoController();
