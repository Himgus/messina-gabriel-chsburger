const CLAVE_SESION = "chs-burger-sesion";
export const EVENTO_SESION_EXPIRADA = "chs-burger:sesion-expirada";
export const obtenerSesion = () => {
    try {
        const guardada = localStorage.getItem(CLAVE_SESION);
        return guardada ? JSON.parse(guardada) : null;
    } catch {
        return null;
    }
};
export const guardarSesion = (sesion) => {
    try {
        localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    } catch {
        return;
    }
};
export const borrarSesion = () => {
    try {
        localStorage.removeItem(CLAVE_SESION);
    } catch {
        return;
    }
};
export const obtenerToken = () => obtenerSesion()?.token ?? null;
