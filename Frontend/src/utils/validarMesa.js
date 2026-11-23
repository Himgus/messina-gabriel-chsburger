import { ETIQUETAS_SECTOR, LIMITES_MESA } from "./constantes.js";
const esEnteroEnRango = (valor, minimo, maximo) => {
    const numero = Number(valor);
    return valor !== "" && Number.isInteger(numero) && numero >= minimo && numero <= maximo;
};
export const VALORES_INICIALES_MESA = Object.freeze({
    numero: "",
    sector: "PANTALLA_GRANDE",
    capacidad: "",
    activa: true
});
export const validarMesa = (valores) => {
    const errores = {};
    if (!esEnteroEnRango(valores.numero, 1, LIMITES_MESA.NUMERO_MAX)) {
        errores.numero = `El número de mesa debe ser un entero entre 1 y ${LIMITES_MESA.NUMERO_MAX}.`;
    }
    if (!Object.keys(ETIQUETAS_SECTOR).includes(valores.sector)) {
        errores.sector = "Elegí el sector de la mesa.";
    }
    if (!esEnteroEnRango(valores.capacidad, 1, LIMITES_MESA.CAPACIDAD_MAX)) {
        errores.capacidad = `La capacidad debe ser un número entero entre 1 y ${LIMITES_MESA.CAPACIDAD_MAX}.`;
    }
    return errores;
};
export const mesaAFormulario = (mesa) => ({
    numero: String(mesa.numero),
    sector: mesa.sector,
    capacidad: String(mesa.capacidad),
    activa: mesa.activa
});
export const formularioAMesa = (valores) => ({
    numero: Number(valores.numero),
    sector: valores.sector,
    capacidad: Number(valores.capacidad),
    activa: valores.activa
});
