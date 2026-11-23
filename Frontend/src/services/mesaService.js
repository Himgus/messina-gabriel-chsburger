import { request } from "./api.js";
const RECURSO = "/mesas";
export function getMesas() {
    return request(RECURSO);
}
export function getMesaById(id) {
    return request(`${RECURSO}/${id}`);
}
export function createMesa(mesa) {
    return request(RECURSO, { method: "POST", body: mesa });
}
export function updateMesa(id, mesa) {
    return request(`${RECURSO}/${id}`, { method: "PUT", body: mesa });
}
export function deleteMesa(id) {
    return request(`${RECURSO}/${id}`, { method: "DELETE" });
}
