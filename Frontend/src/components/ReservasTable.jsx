import Button from "./Button.jsx";
import EstadoReservaEtiqueta from "./EstadoReservaEtiqueta.jsx";
import { EstadoReserva } from "../utils/constantes.js";
import { formatearMesa } from "../utils/formatters.js";
import "./ReservasTable.css";
const ACCIONES_POR_ESTADO = {
    [EstadoReserva.PENDIENTE]: [
        { accion: "senia", texto: "Registrar seña", variante: "principal" },
        { accion: "cancelar", texto: "Cancelar", variante: "peligro" }
    ],
    [EstadoReserva.CONFIRMADA]: [
        { accion: "checkIn", texto: "Check-in", variante: "accion" },
        { accion: "ausente", texto: "No se presentó", variante: "secundario" },
        { accion: "cancelar", texto: "Cancelar", variante: "peligro" }
    ],
    [EstadoReserva.EN_CURSO]: [
        { accion: "finalizar", texto: "Finalizar", variante: "accion" }
    ]
};
const ESTADOS_CON_MESA = [EstadoReserva.CONFIRMADA, EstadoReserva.EN_CURSO];
function SelectorMesa({ reserva, mesas, mesasOcupadas, deshabilitado, onAsignar }) {
    const nombreCliente = `${reserva.cliente.nombre} ${reserva.cliente.apellido}`;
    const disponibles = mesas.filter((mesa) =>
        mesa.id === reserva.mesaId ||
        (mesa.capacidad >= reserva.cantidadPersonas && !mesasOcupadas.has(mesa.id))
    );
    return (
        <>
            <label htmlFor={`mesa-reserva-${reserva.id}`} className="visualmente-oculto">
                Mesa para la reserva de {nombreCliente}
            </label>
            <select
                id={`mesa-reserva-${reserva.id}`}
                className="campo__control reservas-tabla__mesa"
                value={reserva.mesaId ?? ""}
                disabled={deshabilitado}
                onChange={(evento) => onAsignar(reserva, Number(evento.target.value))}
            >
                <option value="" disabled>Elegí una mesa</option>
                {disponibles.map((mesa) => (
                    <option key={mesa.id} value={mesa.id}>{formatearMesa(mesa)}</option>
                ))}
            </select>
        </>
    );
}
export default function ReservasTable({ reservas, mesas, accionEnCurso, onAccion, onAsignarMesa }) {
    const mesasOcupadas = new Set(
        reservas.filter((reserva) => ESTADOS_CON_MESA.includes(reserva.estado) && reserva.mesaId).map((reserva) => reserva.mesaId)
    );
    return (
        <div className="tabla-contenedor" role="region" aria-labelledby="tabla-reservas-titulo" tabIndex={0}>
            <table className="tabla reservas-tabla">
                <caption id="tabla-reservas-titulo" className="visualmente-oculto">
                    Reservas del evento ({reservas.length})
                </caption>
                <thead>
                    <tr>
                        <th scope="col">Cliente</th>
                        <th scope="col">Personas</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Mesa</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {reservas.map((reserva) => {
                        const ocupada = accionEnCurso === reserva.id;
                        const acciones = ACCIONES_POR_ESTADO[reserva.estado] ?? [];
                        return (
                            <tr key={reserva.id}>
                                <th scope="row" className="tabla__evento">
                                    <span className="tabla__titulo">{reserva.cliente.nombre} {reserva.cliente.apellido}</span>
                                    <a href={`tel:${reserva.cliente.telefono}`} className="tabla__detalle">{reserva.cliente.telefono}</a>
                                    {reserva.cliente.ausencias > 0 && (
                                        <span className="reservas-tabla__alerta">
                                            {reserva.cliente.ausencias} {reserva.cliente.ausencias === 1 ? "ausencia" : "ausencias"} en 90 días
                                        </span>
                                    )}
                                    {reserva.observaciones && <span className="tabla__detalle">“{reserva.observaciones}”</span>}
                                </th>
                                <td>{reserva.cantidadPersonas}</td>
                                <td>
                                    <EstadoReservaEtiqueta estado={reserva.estado} />
                                    {reserva.evento?.requiereSenia && (
                                        <span className="tabla__detalle">
                                            Seña {reserva.seniaRegistrada ? "registrada" : "pendiente"}
                                        </span>
                                    )}
                                    {reserva.motivoCancelacion && <span className="tabla__detalle">{reserva.motivoCancelacion}</span>}
                                </td>
                                <td>
                                    {ESTADOS_CON_MESA.includes(reserva.estado) ? (
                                        <SelectorMesa
                                            reserva={reserva}
                                            mesas={mesas}
                                            mesasOcupadas={mesasOcupadas}
                                            deshabilitado={ocupada}
                                            onAsignar={onAsignarMesa}
                                        />
                                    ) : (
                                        reserva.mesa ? formatearMesa(reserva.mesa) : "—"
                                    )}
                                </td>
                                <td>
                                    {acciones.length > 0 ? (
                                        <div className="tabla__acciones tabla__acciones--inicio">
                                            {acciones.map((item) => (
                                                <Button
                                                    key={item.accion}
                                                    variante={item.variante}
                                                    tamanio="chico"
                                                    disabled={ocupada}
                                                    onClick={() => onAccion(item.accion, reserva)}
                                                >
                                                    {item.texto}
                                                    <span className="visualmente-oculto"> ({reserva.cliente.nombre} {reserva.cliente.apellido})</span>
                                                </Button>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="tabla__detalle">Sin acciones</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
