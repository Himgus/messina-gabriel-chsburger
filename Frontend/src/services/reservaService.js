import { request } from "./api.js";
const RECURSO = "/reservas";
export function getReservas(filtros = {}) {
    const parametros = new URLSearchParams(filtros).toString();
    return request(parametros ? `${RECURSO}?${parametros}` : RECURSO);
}
export function getMisReservas() {
    return request(`${RECURSO}/mias`);
}
export function getReservaById(id) {
    return request(`${RECURSO}/${id}`);
}
export function createReserva(reserva) {
    return request(RECURSO, { method: "POST", body: reserva });
}
export function updateReserva(id, reserva) {
    return request(`${RECURSO}/${id}`, { method: "PUT", body: reserva });
}
export function cancelarReserva(id, motivo) {
    return request(`${RECURSO}/${id}/cancelar`, { method: "PATCH", body: { motivo } });
}
export function registrarSenia(id) {
    return request(`${RECURSO}/${id}/senia`, { method: "PATCH" });
}
export function hacerCheckIn(id) {
    return request(`${RECURSO}/${id}/check-in`, { method: "PATCH" });
}
export function finalizarReserva(id) {
    return request(`${RECURSO}/${id}/finalizar`, { method: "PATCH" });
}
export function marcarAusente(id) {
    return request(`${RECURSO}/${id}/ausente`, { method: "PATCH" });
}
export function asignarMesa(id, mesaId) {
    return request(`${RECURSO}/${id}/mesa`, { method: "PATCH", body: { mesaId } });
}
