import { esFechaFutura } from "./fechas.js";
const porFecha = (a, b) => new Date(a.fechaHora) - new Date(b.fechaHora);
export const obtenerProximosEventos = (eventos) => eventos
    .filter((evento) => evento.activo && esFechaFutura(evento.fechaHora))
    .sort(porFecha);
export const obtenerEventoDestacado = (eventos) => {
    const proximos = obtenerProximosEventos(eventos);
    return proximos.find((evento) => evento.destacado) ?? proximos[0] ?? null;
};
export const ordenarPorFecha = (eventos) => [...eventos].sort(porFecha);
const HORAS_CIERRE_RESERVAS = 1;
export const reservasAbiertas = (evento) =>
    evento.activo && new Date(evento.fechaHora).getTime() - Date.now() > HORAS_CIERRE_RESERVAS * 60 * 60 * 1000;
export const estaCompleto = (evento) => evento.lugaresDisponibles <= 0;
