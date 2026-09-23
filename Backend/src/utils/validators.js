export const esTextoNoVacio = (valor) => typeof valor === "string" && valor.trim().length > 0;
export const esTexto = (valor) => typeof valor === "string";
export const esBooleano = (valor) => typeof valor === "boolean";
export const esEnteroPositivo = (valor) => Number.isInteger(valor) && valor > 0;
export const esNumeroPositivo = (valor) => typeof valor === "number" && Number.isFinite(valor) && valor > 0;
export const esFechaValida = (valor) => (typeof valor === "string" || valor instanceof Date) && !Number.isNaN(new Date(valor).getTime());
export const esValorDeEnum = (valor, enumeracion) => Object.values(enumeracion).includes(valor);
export const esObjetoPlano = (valor) => typeof valor === "object" && valor !== null && !Array.isArray(valor);
