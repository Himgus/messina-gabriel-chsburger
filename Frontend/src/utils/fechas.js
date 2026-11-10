const completarConCero = (numero) => String(numero).padStart(2, "0");
export const aInputFechaHora = (fecha) => {
    const valor = new Date(fecha);
    if (Number.isNaN(valor.getTime())) {
        return "";
    }
    const dia = `${valor.getFullYear()}-${completarConCero(valor.getMonth() + 1)}-${completarConCero(valor.getDate())}`;
    const hora = `${completarConCero(valor.getHours())}:${completarConCero(valor.getMinutes())}`;
    return `${dia}T${hora}`;
};
export const desdeInputFechaHora = (valor) => new Date(valor).toISOString();
export const esFechaFutura = (fecha) => new Date(fecha).getTime() > Date.now();
