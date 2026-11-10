import { useCallback } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import EventoDatos from "../components/EventoDatos.jsx";
import EventoEtiquetas from "../components/EventoEtiquetas.jsx";
import ImagenPendiente from "../components/ImagenPendiente.jsx";
import Loader from "../components/Loader.jsx";
import MensajeEstado from "../components/MensajeEstado.jsx";
import PanelReserva from "../components/PanelReserva.jsx";
import { useRecurso } from "../hooks/useRecurso.js";
import { useTituloPagina } from "../hooks/useTituloPagina.js";
import { getEventoById } from "../services/eventoService.js";
import "./EventoDetallePage.css";
export default function EventoDetallePage() {
    const { id } = useParams();
    const cargarEvento = useCallback(() => getEventoById(id), [id]);
    const { datos: evento, cargando, error, recargar } = useRecurso(cargarEvento);
    useTituloPagina(evento?.titulo ?? "Evento");
    return (
        <div className="contenedor pagina">
            {cargando && <Loader mensaje="Cargando el evento…" />}
            {!cargando && error && (
                <MensajeEstado
                    tipo="error"
                    titulo="No pudimos mostrar el evento"
                    accion={
                        <div className="detalle__acciones-error">
                            <Button variante="secundario" onClick={recargar}>Reintentar</Button>
                            <Button to="/#agenda" variante="principal">Ver la agenda</Button>
                        </div>
                    }
                >
                    <p>{error}</p>
                </MensajeEstado>
            )}
            {!cargando && evento && (
                <article className="detalle">
                    <EncabezadoPagina titulo={evento.titulo} descripcion={evento.competencia} volverA="/#agenda" textoVolver="Volver a la agenda" />
                    <div className="detalle__grilla">
                        <div className="detalle__principal">
                            <EventoEtiquetas evento={evento} />
                            <ImagenPendiente descripcion={`foto del evento ${evento.titulo}`} className="detalle__imagen" />
                            <EventoDatos evento={evento} variante="destacado" />
                        </div>
                        <aside className="detalle__lateral" aria-label="Reserva">
                            <PanelReserva evento={evento} />
                        </aside>
                    </div>
                </article>
            )}
        </div>
    );
}
