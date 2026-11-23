const MINUTO = 60 * 1000;
const HORA = 60 * MINUTO;
const DIA = 24 * HORA;
export const minutosDesdeAhora = (minutos) => new Date(Date.now() + minutos * MINUTO);
export const horasHasta = (fecha) => (new Date(fecha).getTime() - Date.now()) / HORA;
export const minutosDesde = (fecha) => (Date.now() - new Date(fecha).getTime()) / MINUTO;
export const horasDesde = (fecha) => (Date.now() - new Date(fecha).getTime()) / HORA;
export const diasDesde = (fecha) => (Date.now() - new Date(fecha).getTime()) / DIA;
