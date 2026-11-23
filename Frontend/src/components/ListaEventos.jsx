import Button from "./Button.jsx";
import EventoCard from "./EventoCard.jsx";
import Loader from "./Loader.jsx";
import MensajeEstado from "./MensajeEstado.jsx";
export default function ListaEventos({ eventos, cargando, error, onReintentar }) {
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
        <ul className="grilla" role="list">
            {eventos.map((evento) => (
                <li key={evento.id}>
                    <EventoCard evento={evento} />
                </li>
            ))}
        </ul>
    );
}
