import { request } from "./api.js";
const RECURSO = "/eventos";
export function getEventos() {
    return request(RECURSO);
}
export function getEventoById(id) {
    return request(`${RECURSO}/${id}`);
}
export function createEvento(evento) {
    return request(RECURSO, { method: "POST", body: evento });
}
export function updateEvento(id, evento) {
    return request(`${RECURSO}/${id}`, { method: "PUT", body: evento });
}
export function deleteEvento(id) {
    return request(`${RECURSO}/${id}`, { method: "DELETE" });
}
