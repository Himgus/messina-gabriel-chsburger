import { TipoEvento, LIMITES_EVENTO } from "./constantes.js";
import { esFechaFutura } from "./fechas.js";
export const validarEvento = (valores, { esNuevo, capacidadLocal }) => {
    const errores = {};
    const titulo = valores.titulo.trim();
    if (!titulo) {
        errores.titulo = "Ingresá el título del evento.";
    } else if (titulo.length > LIMITES_EVENTO.TITULO_MAX) {
        errores.titulo = `El título no puede superar los ${LIMITES_EVENTO.TITULO_MAX} caracteres.`;
    }
    if (!Object.values(TipoEvento).includes(valores.tipo)) {
        errores.tipo = "Elegí el tipo de evento.";
    }
    if (valores.competencia.trim().length > LIMITES_EVENTO.COMPETENCIA_MAX) {
        errores.competencia = `La competencia no puede superar los ${LIMITES_EVENTO.COMPETENCIA_MAX} caracteres.`;
    }
    if (!valores.fechaHora) {
        errores.fechaHora = "Ingresá la fecha y hora del evento.";
    } else if (Number.isNaN(new Date(valores.fechaHora).getTime())) {
        errores.fechaHora = "Ingresá una fecha y hora válidas.";
    } else if (esNuevo && !esFechaFutura(valores.fechaHora)) {
        errores.fechaHora = "La fecha del evento debe ser futura.";
    }
    const cupo = Number(valores.cupo);
    if (valores.cupo === "" || !Number.isInteger(cupo) || cupo <= 0) {
        errores.cupo = "El cupo debe ser un número entero mayor a 0.";
    } else if (cupo > capacidadLocal) {
        errores.cupo = `El cupo no puede superar la capacidad del local (${capacidadLocal} personas).`;
    }
    const montoSenia = Number(valores.montoSenia);
    if (valores.requiereSenia && (valores.montoSenia === "" || !Number.isFinite(montoSenia) || montoSenia <= 0)) {
        errores.montoSenia = "Ingresá el monto de la seña.";
    }
    return errores;
};
