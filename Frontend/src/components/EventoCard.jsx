import Button from "./Button.jsx";
import EventoDatos from "./EventoDatos.jsx";
import EventoEtiquetas from "./EventoEtiquetas.jsx";
import { estaCompleto } from "../utils/eventos.js";
import "./EventoCard.css";
export default function EventoCard({ evento }) {
    const completo = estaCompleto(evento);
    return (
        <article className="evento-card">
            <div className="evento-card__cabecera">
                <EventoEtiquetas evento={evento} />
            </div>
            <div className="evento-card__cuerpo">
                <h3 className="evento-card__titulo">{evento.titulo}</h3>
                <p className="evento-card__competencia">{evento.competencia || "Evento especial CHS"}</p>
                <EventoDatos evento={evento} />
            </div>
            <div className="evento-card__pie">
                <Button
                    to={`/eventos/${evento.id}`}
                    variante={completo ? "secundario" : "accion"}
                    className="evento-card__boton"
                >
                    {completo ? "Ver detalle" : "Reservar"}
                    <span className="visualmente-oculto"> {completo ? "de" : "mesa para"} {evento.titulo}</span>
                </Button>
            </div>
        </article>
    );
}
