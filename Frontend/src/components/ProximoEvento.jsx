import Button from "./Button.jsx";
import EventoCard from "./EventoCard.jsx";
import Loader from "./Loader.jsx";
import Seccion from "./Seccion.jsx";
import "./ProximoEvento.css";
export default function ProximoEvento({ evento, cargando }) {
    return (
        <Seccion
            id="proximo-partido"
            titulo="En nuestras pantallas"
            subtitulo="Partidos y shows en el local. Reservá tu mesa antes de que se llene."
            variante="amarilla"
        >
            <div className="proximo-evento">
                {cargando && <Loader mensaje="Buscando el próximo partido…" />}
                {!cargando && evento && <EventoCard evento={evento} />}
                {!cargando && !evento && (
                    <p className="proximo-evento__vacio">Por ahora no hay partidos programados. ¡Seguinos en redes para enterarte!</p>
                )}
                <Button to="/eventos" variante="secundario">Ver todos los eventos</Button>
            </div>
        </Seccion>
    );
}
