import Button from "./Button.jsx";
import EventoEtiquetas from "./EventoEtiquetas.jsx";
import { esFechaFutura } from "../utils/fechas.js";
import { formatearFechaCorta, formatearHora, formatearMoneda } from "../utils/formatters.js";
export default function EventosTable({ eventos, onSuspender, onEliminar }) {
    return (
        <div className="tabla-contenedor" role="region" aria-labelledby="tabla-eventos-titulo" tabIndex={0}>
            <table className="tabla">
                <caption id="tabla-eventos-titulo" className="visualmente-oculto">
                    Listado de eventos cargados ({eventos.length})
                </caption>
                <thead>
                    <tr>
                        <th scope="col">Evento</th>
                        <th scope="col">Fecha y hora</th>
                        <th scope="col">Libres / cupo</th>
                        <th scope="col">Seña</th>
                        <th scope="col"><span className="visualmente-oculto">Acciones</span></th>
                    </tr>
                </thead>
                <tbody>
                    {eventos.map((evento) => (
                        <tr key={evento.id}>
                            <th scope="row" className="tabla__evento">
                                <span className="tabla__titulo">{evento.titulo}</span>
                                {evento.competencia && <span className="tabla__detalle">{evento.competencia}</span>}
                                <EventoEtiquetas evento={evento} mostrarEstado />
                            </th>
                            <td>
                                {formatearFechaCorta(evento.fechaHora)}
                                <span className="tabla__detalle">{formatearHora(evento.fechaHora)}</span>
                            </td>
                            <td>{evento.lugaresDisponibles} / {evento.cupo}</td>
                            <td>{evento.requiereSenia ? formatearMoneda(evento.montoSenia) : "No"}</td>
                            <td>
                                <div className="tabla__acciones">
                                    <Button to={`/admin/eventos/${evento.id}/editar`} variante="secundario" tamanio="chico">
                                        Editar<span className="visualmente-oculto"> {evento.titulo}</span>
                                    </Button>
                                    {evento.activo && esFechaFutura(evento.fechaHora) && (
                                        <Button variante="secundario" tamanio="chico" onClick={() => onSuspender(evento)}>
                                            Suspender<span className="visualmente-oculto"> {evento.titulo}</span>
                                        </Button>
                                    )}
                                    <Button variante="peligro" tamanio="chico" onClick={() => onEliminar(evento)}>
                                        Eliminar<span className="visualmente-oculto"> {evento.titulo}</span>
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
