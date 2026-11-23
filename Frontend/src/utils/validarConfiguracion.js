import { LIMITES_CONFIGURACION } from "./constantes.js";
export const validarConfiguracion = ({ capacidadLocal, horarios }) => {
    const errores = {};
    const capacidad = Number(capacidadLocal);
    if (capacidadLocal === "" || !Number.isInteger(capacidad) || capacidad < 1 || capacidad > LIMITES_CONFIGURACION.CAPACIDAD_MAX) {
        errores.capacidadLocal = `La capacidad debe ser un número entero entre 1 y ${LIMITES_CONFIGURACION.CAPACIDAD_MAX}.`;
    }
    horarios.forEach((franja, indice) => {
        ["dias", "horario"].forEach((campo) => {
            const texto = franja[campo].trim();
            if (!texto) {
                errores[`${campo}-${indice}`] = campo === "dias" ? "Indicá los días." : "Indicá el horario.";
            } else if (texto.length > LIMITES_CONFIGURACION.TEXTO_HORARIO_MAX) {
                errores[`${campo}-${indice}`] = `Máximo ${LIMITES_CONFIGURACION.TEXTO_HORARIO_MAX} caracteres.`;
            }
        });
    });
    return errores;
};
