import Button from "./Button.jsx";
import EstadoReservaEtiqueta from "./EstadoReservaEtiqueta.jsx";
import ListaDatos from "./ListaDatos.jsx";
import { EstadoReserva, ESTADOS_ACTIVOS } from "../utils/constantes.js";
import { formatearFecha, formatearHora, formatearMesa, formatearMoneda, formatearPersonas } from "../utils/formatters.js";
import "./ReservaCard.css";
function obtenerDatos(reserva) {
    const { evento } = reserva;
    const items = [];
    if (evento) {
        items.push({ icono: "calendario", etiqueta: "Fecha", valor: `${formatearFecha(evento.fechaHora)}, ${formatearHora(evento.fechaHora)}` });
    }
    items.push({ icono: "personas", etiqueta: "Personas", valor: formatearPersonas(reserva.cantidadPersonas) });
    items.push({ icono: "ubicacion", etiqueta: "Mesa", valor: reserva.mesa ? formatearMesa(reserva.mesa) : "A asignar por el local" });
    if (evento?.requiereSenia || reserva.estado === EstadoReserva.PENDIENTE) {
        items.push({
            icono: "dinero",
            etiqueta: "Seña",
            valor: reserva.seniaRegistrada ? "Registrada" : "Pendiente"
        });
    }
    return items;
}
export default function ReservaCard({ reserva, onCancelar }) {
    const { evento } = reserva;
    const activa = ESTADOS_ACTIVOS.includes(reserva.estado);
    return (
        <article className={`reserva-card${activa ? "" : " reserva-card--cerrada"}`}>
            <header className="reserva-card__cabecera">
                <EstadoReservaEtiqueta estado={reserva.estado} />
                <span className="reserva-card__numero">Reserva #{reserva.id}</span>
            </header>
            <div className="reserva-card__cuerpo">
                <h3 className="reserva-card__titulo">{evento?.titulo ?? "Evento eliminado"}</h3>
                <ListaDatos items={obtenerDatos(reserva)} />
                {reserva.observaciones && (
                    <p className="reserva-card__nota"><strong>Observaciones:</strong> {reserva.observaciones}</p>
                )}
                {reserva.estado === EstadoReserva.PENDIENTE && (
                    <p className="reserva-card__aviso" role="note">
                        Tu lugar está guardado. Para confirmar la reserva aboná la seña
                        {evento?.requiereSenia ? ` de ${formatearMoneda(evento.montoSenia)}` : ""} en el local o por WhatsApp
                        dentro de las próximas 24 horas.
                    </p>
                )}
                {reserva.estado === EstadoReserva.CANCELADA && reserva.motivoCancelacion && (
                    <p className="reserva-card__nota"><strong>Motivo:</strong> {reserva.motivoCancelacion}</p>
                )}
                {activa && !reserva.puedeModificarse && (
                    <p className="reserva-card__nota">Faltan menos de 2 horas para el evento: para cambios comunicate con el local.</p>
                )}
            </div>
            {reserva.puedeModificarse && (
                <footer className="reserva-card__acciones">
                    <Button to={`/mis-reservas/${reserva.id}/editar`} variante="secundario" tamanio="chico">
                        Modificar<span className="visualmente-oculto"> reserva para {evento?.titulo}</span>
                    </Button>
                    <Button variante="peligro" tamanio="chico" onClick={() => onCancelar(reserva)}>
                        Cancelar<span className="visualmente-oculto"> reserva para {evento?.titulo}</span>
                    </Button>
                </footer>
            )}
        </article>
    );
}
