import { TipoEvento } from "./constantes.js";
import { aInputFechaHora, desdeInputFechaHora } from "./fechas.js";
export const VALORES_INICIALES_EVENTO = Object.freeze({
    titulo: "",
    tipo: TipoEvento.PARTIDO,
    competencia: "",
    fechaHora: "",
    cupo: "",
    requiereSenia: false,
    montoSenia: "",
    destacado: false,
    activo: true
});
export const eventoAFormulario = (evento) => ({
    titulo: evento.titulo,
    tipo: evento.tipo,
    competencia: evento.competencia ?? "",
    fechaHora: aInputFechaHora(evento.fechaHora),
    cupo: String(evento.cupo),
    requiereSenia: evento.requiereSenia,
    montoSenia: evento.requiereSenia ? String(evento.montoSenia) : "",
    destacado: evento.destacado,
    activo: evento.activo
});
export const formularioAEvento = (valores) => ({
    titulo: valores.titulo.trim(),
    tipo: valores.tipo,
    competencia: valores.competencia.trim() || null,
    fechaHora: desdeInputFechaHora(valores.fechaHora),
    cupo: Number(valores.cupo),
    requiereSenia: valores.requiereSenia,
    montoSenia: valores.requiereSenia ? Number(valores.montoSenia) : 0,
    destacado: valores.destacado,
    activo: valores.activo
});
