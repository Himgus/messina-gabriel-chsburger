import Button from "./Button.jsx";
import EventoDatos from "./EventoDatos.jsx";
import EventoEtiquetas from "./EventoEtiquetas.jsx";
import ImagenPendiente from "./ImagenPendiente.jsx";
import Loader from "./Loader.jsx";
import { estaCompleto } from "../utils/eventos.js";
import "./Hero.css";
function HeroEvento({ evento }) {
    return (
        <>
            <p className="hero__antetitulo">Próximo evento destacado</p>
            <EventoEtiquetas evento={evento} />
            <h1 className="hero__titulo">{evento.titulo}</h1>
            <span className="hero__linea" aria-hidden="true" />
            <EventoDatos evento={evento} variante="oscuro" />
            <Button to={`/eventos/${evento.id}`} variante="accion" tamanio="grande" className="hero__cta">
                {estaCompleto(evento) ? "Ver el evento" : "Reservá tu mesa"}
            </Button>
        </>
    );
}
function HeroMarca() {
    return (
        <>
            <p className="hero__antetitulo">La casa del Megabaldazo</p>
            <h1 className="hero__titulo">Partidos, amigos y baldes de hamburguesas</h1>
            <span className="hero__linea" aria-hidden="true" />
            <p className="hero__texto">Mirá los partidos en nuestras pantallas y reservá tu mesa para el próximo evento.</p>
            <Button to="/#agenda" variante="accion" tamanio="grande" className="hero__cta">
                Ver la agenda
            </Button>
        </>
    );
}
export default function Hero({ evento, cargando }) {
    return (
        <section className="hero" aria-label="Portada">
            <div className="contenedor hero__contenido">
                <ImagenPendiente descripcion="foto del Megabaldazo o del salón con las pantallas" className="hero__imagen" />
                <div className="hero__info">
                    {cargando ? (
                        <Loader mensaje="Buscando el próximo evento…" claro />
                    ) : evento ? (
                        <HeroEvento evento={evento} />
                    ) : (
                        <HeroMarca />
                    )}
                </div>
            </div>
        </section>
    );
}
