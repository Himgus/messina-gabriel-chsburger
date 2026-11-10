import { LIMITES_RESERVA } from "./constantes.js";
export const validarReserva = (valores, { lugaresDisponibles }) => {
    const errores = {};
    const cantidad = Number(valores.cantidadPersonas);
    if (valores.cantidadPersonas === "" || !Number.isInteger(cantidad)) {
        errores.cantidadPersonas = "Ingresá la cantidad de personas.";
    } else if (cantidad < LIMITES_RESERVA.MIN_PERSONAS || cantidad > LIMITES_RESERVA.MAX_PERSONAS) {
        errores.cantidadPersonas = `Cada reserva es de ${LIMITES_RESERVA.MIN_PERSONAS} a ${LIMITES_RESERVA.MAX_PERSONAS} personas. Para grupos más grandes, comunicate con el local.`;
    } else if (cantidad > lugaresDisponibles) {
        errores.cantidadPersonas = lugaresDisponibles === 1
            ? "Solo queda 1 lugar para este evento."
            : `Solo quedan ${lugaresDisponibles} lugares para este evento.`;
    }
    if (valores.observaciones.trim().length > LIMITES_RESERVA.OBSERVACIONES_MAX) {
        errores.observaciones = `Las observaciones no pueden superar los ${LIMITES_RESERVA.OBSERVACIONES_MAX} caracteres.`;
    }
    return errores;
};
export const reservaAFormulario = (reserva) => ({
    cantidadPersonas: reserva ? String(reserva.cantidadPersonas) : "2",
    observaciones: reserva?.observaciones ?? ""
});
export const formularioAReserva = (valores) => ({
    cantidadPersonas: Number(valores.cantidadPersonas),
    observaciones: valores.observaciones.trim() || null
});
