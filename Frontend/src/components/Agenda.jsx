import Button from "./Button.jsx";
import EventoCard from "./EventoCard.jsx";
import Loader from "./Loader.jsx";
import MensajeEstado from "./MensajeEstado.jsx";
import Seccion from "./Seccion.jsx";
function ContenidoAgenda({ eventos, cargando, error, onReintentar }) {
    if (cargando) {
        return <Loader mensaje="Cargando la agenda…" />;
    }
    if (error) {
        return (
            <MensajeEstado
                tipo="error"
                titulo="No pudimos cargar la agenda"
                accion={<Button variante="secundario" onClick={onReintentar}>Reintentar</Button>}
            >
                <p>{error}</p>
            </MensajeEstado>
        );
    }
    if (eventos.length === 0) {
        return (
            <MensajeEstado titulo="Todavía no hay eventos programados">
                <p>Pronto vamos a publicar los próximos partidos y shows. ¡Seguinos en redes!</p>
            </MensajeEstado>
        );
    }
    return (
        <ul className="grilla agenda__lista" role="list">
            {eventos.map((evento) => (
                <li key={evento.id}>
                    <EventoCard evento={evento} />
                </li>
            ))}
        </ul>
    );
}
export default function Agenda(props) {
    return (
        <Seccion
            id="agenda"
            titulo="Agenda"
            subtitulo="Próximos partidos y eventos en CHS Burger. Elegí uno y reservá tu mesa antes de que se llene."
            variante="amarilla"
        >
            <ContenidoAgenda {...props} />
        </Seccion>
    );
}
