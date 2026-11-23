import { formatearEstadoReserva, formatearFechaHora } from "../utils/formatters.js";
import "./HistorialReserva.css";
export default function HistorialReserva({ historial }) {
    if (!historial?.length) {
        return null;
    }
    return (
        <details className="historial">
            <summary className="historial__resumen">Ver historial ({historial.length} {historial.length === 1 ? "cambio" : "cambios"})</summary>
            <ol className="historial__lista">
                {historial.map((cambio) => (
                    <li key={cambio.id} className="historial__item">
                        <span className="historial__estado">
                            {cambio.estadoAnterior === cambio.estadoNuevo ? "Modificación" : formatearEstadoReserva(cambio.estadoNuevo)}
                        </span>
                        <span className="historial__detalle">
                            {formatearFechaHora(cambio.fechaHora)} · {cambio.responsable}
                        </span>
                        {cambio.motivo && <span className="historial__detalle">{cambio.motivo}</span>}
                    </li>
                ))}
            </ol>
        </details>
    );
}
