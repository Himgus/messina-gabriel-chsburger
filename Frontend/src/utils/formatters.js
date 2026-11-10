import { ETIQUETAS_ESTADO_RESERVA, ETIQUETAS_SECTOR, ETIQUETAS_TIPO_EVENTO } from "./constantes.js";
const formatoFecha = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long"
});
const formatoFechaCorta = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
});
const formatoHora = new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
});
const formatoMoneda = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
});
export const formatearFecha = (fecha) => formatoFecha.format(new Date(fecha));
export const formatearFechaCorta = (fecha) => formatoFechaCorta.format(new Date(fecha));
export const formatearHora = (fecha) => `${formatoHora.format(new Date(fecha))} h`;
export const formatearFechaHora = (fecha) => `${formatearFechaCorta(fecha)} ${formatearHora(fecha)}`;
export const formatearMoneda = (monto) => formatoMoneda.format(monto);
export const formatearTipoEvento = (tipo) => ETIQUETAS_TIPO_EVENTO[tipo] ?? tipo;
export const formatearEstadoReserva = (estado) => ETIQUETAS_ESTADO_RESERVA[estado] ?? estado;
export const formatearSector = (sector) => ETIQUETAS_SECTOR[sector] ?? sector;
export const formatearPersonas = (cantidad) => `${cantidad} ${cantidad === 1 ? "persona" : "personas"}`;
export const formatearLugares = (cantidad) => (cantidad === 1 ? "1 lugar libre" : `${cantidad} lugares libres`);
export const formatearMesa = (mesa) => `Mesa ${mesa.numero} · ${formatearSector(mesa.sector)} (${mesa.capacidad})`;
