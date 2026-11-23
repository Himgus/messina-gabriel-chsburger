import multer from "multer";
import { randomUUID } from "node:crypto";
import { BadRequestError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { DIRECTORIO_IMAGENES_PRODUCTOS } from "../utils/archivos.js";
const EXTENSIONES = Object.freeze({
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp"
});
const TAMANIO_MAXIMO = 3 * 1024 * 1024;
const subida = multer({
    storage: multer.diskStorage({
        destination: (req, archivo, callback) => callback(null, DIRECTORIO_IMAGENES_PRODUCTOS),
        filename: (req, archivo, callback) => callback(null, `${randomUUID()}${EXTENSIONES[archivo.mimetype]}`)
    }),
    limits: { fileSize: TAMANIO_MAXIMO, files: 1 },
    fileFilter: (req, archivo, callback) => {
        if (!EXTENSIONES[archivo.mimetype]) {
            return callback(new BadRequestError(Messages.IMAGEN_FORMATO));
        }
        callback(null, true);
    }
}).single("imagen");
export const subirImagen = (req, res, next) => {
    subida(req, res, (error) => {
        if (error instanceof multer.MulterError) {
            return next(new BadRequestError(error.code === "LIMIT_FILE_SIZE" ? Messages.IMAGEN_TAMANIO : Messages.INVALID_DATA));
        }
        next(error);
    });
};
