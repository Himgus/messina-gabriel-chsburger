import fs from "node:fs";
import path from "node:path";
const RAIZ_BACKEND = path.resolve(import.meta.dirname, "../..");
export const DIRECTORIO_PUBLICO = path.join(RAIZ_BACKEND, "public");
export const DIRECTORIO_SUBIDAS = path.join(RAIZ_BACKEND, "uploads");
export const DIRECTORIO_IMAGENES_PRODUCTOS = path.join(DIRECTORIO_SUBIDAS, "productos");
export const RUTA_IMAGENES_PRODUCTOS = "/uploads/productos";
fs.mkdirSync(DIRECTORIO_IMAGENES_PRODUCTOS, { recursive: true });
export const esImagenSubida = (ruta) => typeof ruta === "string" && ruta.startsWith(`${RUTA_IMAGENES_PRODUCTOS}/`);
export const eliminarImagenSubida = (ruta) => {
    if (!esImagenSubida(ruta)) {
        return;
    }
    fs.rm(path.join(DIRECTORIO_IMAGENES_PRODUCTOS, path.basename(ruta)), { force: true }, () => {});
};
