import { borrarSesion, EVENTO_SESION_EXPIRADA, obtenerToken } from "../utils/sesion.js";
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
const ERROR_CONEXION = "No se pudo conectar con el servidor. Verificá que el backend esté en funcionamiento.";
const ERROR_DESCONOCIDO = "Ocurrió un error inesperado. Intentá nuevamente.";
const NO_AUTORIZADO = 401;
export async function request(path, options = {}) {
    const token = obtenerToken();
    const config = {
        method: options.method ?? "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
    };
    if (options.body !== undefined) {
        config.body = JSON.stringify(options.body);
    }
    let response;
    try {
        response = await fetch(`${API_URL}${path}`, config);
    } catch {
        throw new Error(ERROR_CONEXION);
    }
    const contenido = await response.json().catch(() => null);
    if (response.status === NO_AUTORIZADO && token) {
        borrarSesion();
        window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));
    }
    if (!response.ok || !contenido?.success) {
        throw new Error(contenido?.message ?? ERROR_DESCONOCIDO);
    }
    return contenido.data;
}
