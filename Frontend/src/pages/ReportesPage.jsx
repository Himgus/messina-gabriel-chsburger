import Button from "../components/Button.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import ListaDatos from "../components/ListaDatos.jsx";
import Loader from "../components/Loader.jsx";
import MensajeEstado from "../components/MensajeEstado.jsx";
import { useRecurso } from "../hooks/useRecurso.js";
import { useTituloPagina } from "../hooks/useTituloPagina.js";
import { getReporteOcupacion } from "../services/reporteService.js";
import { formatearFechaHora } from "../utils/formatters.js";
import "./ReportesPage.css";
const sumar = (filas, campo) => filas.reduce((total, fila) => total + fila[campo], 0);
export default function ReportesPage() {
    useTituloPagina("Reportes de ocupación");
    const { datos, cargando, error, recargar } = useRecurso(getReporteOcupacion);
    const filas = datos ?? [];
    return (
        <div className="contenedor pagina">
            <EncabezadoPagina
                titulo="Reportes de ocupación"
                descripcion="Ranking de los eventos que más gente convocaron, con su ocupación, cancelaciones y ausencias."
            />
            {cargando && <Loader mensaje="Calculando reportes…" />}
            {!cargando && error && (
                <MensajeEstado
                    tipo="error"
                    titulo="No pudimos generar el reporte"
                    accion={<Button variante="secundario" onClick={recargar}>Reintentar</Button>}
                >
                    <p>{error}</p>
                </MensajeEstado>
            )}
            {!cargando && !error && filas.length === 0 && (
                <MensajeEstado titulo="Todavía no hay datos">
                    <p>Cargá eventos y recibí reservas para ver los reportes.</p>
                </MensajeEstado>
            )}
            {!cargando && !error && filas.length > 0 && (
                <>
                    <ListaDatos
                        variante="destacado"
                        items={[
                            { icono: "trofeo", etiqueta: "Reservas totales", valor: sumar(filas, "reservas") },
                            { icono: "personas", etiqueta: "Personas", valor: sumar(filas, "personasReservadas") },
                            { icono: "cerrar", etiqueta: "Cancelaciones", valor: sumar(filas, "cancelaciones") },
                            { icono: "alerta", etiqueta: "Ausencias", valor: sumar(filas, "ausencias") }
                        ]}
                    />
                    <div className="tabla-contenedor reportes__tabla" role="region" aria-labelledby="tabla-reporte-titulo" tabIndex={0}>
                        <table className="tabla">
                            <caption id="tabla-reporte-titulo" className="visualmente-oculto">
                                Ocupación por evento, ordenada de mayor a menor cantidad de personas
                            </caption>
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Evento</th>
                                    <th scope="col">Ocupación</th>
                                    <th scope="col">Reservas</th>
                                    <th scope="col">Cancelaciones</th>
                                    <th scope="col">Ausencias</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filas.map((fila, indice) => (
                                    <tr key={fila.eventoId}>
                                        <td className="reportes__puesto">{indice + 1}</td>
                                        <th scope="row" className="tabla__evento">
                                            <span className="tabla__titulo">{fila.titulo}</span>
                                            <span className="tabla__detalle">{formatearFechaHora(fila.fechaHora)}</span>
                                        </th>
                                        <td>
                                            <div className="reportes__ocupacion">
                                                <span className="reportes__barra" aria-hidden="true">
                                                    <span style={{ width: `${Math.min(fila.porcentajeOcupacion, 100)}%` }} />
                                                </span>
                                                <span>
                                                    {fila.porcentajeOcupacion}%
                                                    <span className="tabla__detalle">{fila.personasReservadas} de {fila.cupo} personas</span>
                                                </span>
                                            </div>
                                        </td>
                                        <td>{fila.reservas}</td>
                                        <td>{fila.cancelaciones}</td>
                                        <td>{fila.ausencias}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
