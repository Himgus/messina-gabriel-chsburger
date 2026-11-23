import { CategoriaProducto, LIMITES_PRODUCTO, TIPOS_IMAGEN } from "./constantes.js";
let ultimaClave = 0;
export const nuevaOpcion = (opcion = { nombre: "", precio: "", adicional: true }) => {
    ultimaClave++;
    return { ...opcion, precio: String(opcion.precio), clave: ultimaClave };
};
export const VALORES_INICIALES_PRODUCTO = Object.freeze({
    nombre: "",
    categoria: CategoriaProducto.BURGER,
    descripcion: "",
    precio: "",
    destacado: false,
    disponible: true
});
const esPrecioValido = (valor) => {
    const numero = Number(valor);
    return valor !== "" && Number.isInteger(numero) && numero >= 1 && numero <= LIMITES_PRODUCTO.PRECIO_MAX;
};
const MENSAJE_PRECIO = "El precio debe ser un número entero entre 1 y 1.000.000.";
export const validarProducto = (valores, opciones) => {
    const errores = {};
    const nombre = valores.nombre.trim();
    if (!nombre) {
        errores.nombre = "Ingresá el nombre del producto.";
    } else if (nombre.length > LIMITES_PRODUCTO.NOMBRE_MAX) {
        errores.nombre = `El nombre no puede superar los ${LIMITES_PRODUCTO.NOMBRE_MAX} caracteres.`;
    }
    if (!Object.values(CategoriaProducto).includes(valores.categoria)) {
        errores.categoria = "Elegí la categoría.";
    }
    if (valores.descripcion.trim().length > LIMITES_PRODUCTO.DESCRIPCION_MAX) {
        errores.descripcion = `La descripción no puede superar los ${LIMITES_PRODUCTO.DESCRIPCION_MAX} caracteres.`;
    }
    if (!esPrecioValido(valores.precio)) {
        errores.precio = MENSAJE_PRECIO;
    }
    opciones.forEach((opcion, indice) => {
        if (!opcion.nombre.trim()) {
            errores[`opcion-nombre-${indice}`] = "Ingresá el nombre de la opción.";
        } else if (opcion.nombre.trim().length > LIMITES_PRODUCTO.NOMBRE_MAX) {
            errores[`opcion-nombre-${indice}`] = `Máximo ${LIMITES_PRODUCTO.NOMBRE_MAX} caracteres.`;
        }
        if (!esPrecioValido(opcion.precio)) {
            errores[`opcion-precio-${indice}`] = MENSAJE_PRECIO;
        }
    });
    return errores;
};
export const validarArchivoImagen = (archivo) => {
    if (!TIPOS_IMAGEN.includes(archivo.type)) {
        return "La imagen debe ser PNG, JPG o WEBP.";
    }
    if (archivo.size > LIMITES_PRODUCTO.IMAGEN_MAX_MB * 1024 * 1024) {
        return `La imagen no puede pesar más de ${LIMITES_PRODUCTO.IMAGEN_MAX_MB} MB.`;
    }
    return undefined;
};
export const productoAFormulario = (producto) => ({
    nombre: producto.nombre,
    categoria: producto.categoria,
    descripcion: producto.descripcion,
    precio: String(producto.precio),
    destacado: producto.destacado,
    disponible: producto.disponible
});
export const formularioAProducto = (valores, opciones, imagen) => ({
    nombre: valores.nombre.trim(),
    categoria: valores.categoria,
    descripcion: valores.descripcion.trim(),
    precio: Number(valores.precio),
    imagen,
    opciones: opciones.map((opcion) => ({
        nombre: opcion.nombre.trim(),
        precio: Number(opcion.precio),
        adicional: opcion.adicional
    })),
    destacado: valores.destacado,
    disponible: valores.disponible
});
