import Etiqueta from "./Etiqueta.jsx";
import { estaCompleto } from "../utils/eventos.js";
import { formatearTipoEvento } from "../utils/formatters.js";
export default function EventoEtiquetas({ evento, mostrarEstado = false }) {
    return (
        <div className="evento-etiquetas">
            <Etiqueta variante="oscura">{formatearTipoEvento(evento.tipo)}</Etiqueta>
            {evento.destacado && <Etiqueta variante="principal">Destacado</Etiqueta>}
            {estaCompleto(evento) && <Etiqueta variante="acento">Completo</Etiqueta>}
            {mostrarEstado && !evento.activo && <Etiqueta variante="apagada">Oculto</Etiqueta>}
        </div>
    );
}
