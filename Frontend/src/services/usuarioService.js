import { request } from "./api.js";
const RECURSO = "/usuarios";
export function getUsuarios(filtros = {}) {
    const parametros = new URLSearchParams(filtros).toString();
    return request(parametros ? `${RECURSO}?${parametros}` : RECURSO);
}
export function getUsuarioById(id) {
    return request(`${RECURSO}/${id}`);
}
export function createUsuario(usuario) {
    return request(RECURSO, { method: "POST", body: usuario });
}
export function cambiarEstadoUsuario(id, activo) {
    return request(`${RECURSO}/${id}/estado`, { method: "PATCH", body: { activo } });
}
