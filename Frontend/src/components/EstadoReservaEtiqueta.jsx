import Etiqueta from "./Etiqueta.jsx";
import { VARIANTES_ESTADO_RESERVA } from "../utils/constantes.js";
import { formatearEstadoReserva } from "../utils/formatters.js";
export default function EstadoReservaEtiqueta({ estado }) {
    return <Etiqueta variante={VARIANTES_ESTADO_RESERVA[estado]}>{formatearEstadoReserva(estado)}</Etiqueta>;
}
