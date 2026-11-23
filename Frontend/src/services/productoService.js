import { request } from "./api.js";
const RECURSO = "/productos";
export function getProductos(filtros = {}) {
    const parametros = new URLSearchParams(filtros).toString();
    return request(parametros ? `${RECURSO}?${parametros}` : RECURSO);
}
export function getProductosDestacados() {
    return getProductos({ destacado: "true" });
}
export function getProductoById(id) {
    return request(`${RECURSO}/${id}`);
}
export function createProducto(producto) {
    return request(RECURSO, { method: "POST", body: producto });
}
export function updateProducto(id, producto) {
    return request(`${RECURSO}/${id}`, { method: "PUT", body: producto });
}
export function deleteProducto(id) {
    return request(`${RECURSO}/${id}`, { method: "DELETE" });
}
export function subirImagenProducto(archivo) {
    const datos = new FormData();
    datos.append("imagen", archivo);
    return request(`${RECURSO}/imagen`, { method: "POST", body: datos });
}
