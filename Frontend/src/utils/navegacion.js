import { Rol } from "./constantes.js";
const RUTAS_INICIALES = Object.freeze({
    [Rol.CLIENTE]: "/",
    [Rol.EMPLEADO]: "/panel/reservas",
    [Rol.ADMINISTRADOR]: "/admin/eventos"
});
export const rutaInicial = (usuario) => RUTAS_INICIALES[usuario.rol] ?? "/";
