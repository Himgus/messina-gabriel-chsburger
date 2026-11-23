import { request } from "./api.js";
const RECURSO = "/configuracion";
export function getConfiguracion() {
    return request(RECURSO);
}
export function updateConfiguracion(configuracion) {
    return request(RECURSO, { method: "PUT", body: configuracion });
}
