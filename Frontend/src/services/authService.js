import { request } from "./api.js";
const RECURSO = "/auth";
export function login(credenciales) {
    return request(`${RECURSO}/login`, { method: "POST", body: credenciales });
}
export function registrarse(datos) {
    return request(`${RECURSO}/registro`, { method: "POST", body: datos });
}
export function getPerfil() {
    return request(`${RECURSO}/perfil`);
}
export function updatePerfil(datos) {
    return request(`${RECURSO}/perfil`, { method: "PUT", body: datos });
}
export function deletePerfil(contrasena) {
    return request(`${RECURSO}/perfil`, { method: "DELETE", body: { contrasena } });
}
