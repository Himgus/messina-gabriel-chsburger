import { useMemo } from "react";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import ListaEventos from "../components/ListaEventos.jsx";
import { useRecurso } from "../hooks/useRecurso.js";
import { useTituloPagina } from "../hooks/useTituloPagina.js";
import { getEventos } from "../services/eventoService.js";
import { LIMITES_RESERVA } from "../utils/constantes.js";
import { obtenerProximosEventos } from "../utils/eventos.js";
import "./EventosPage.css";
const PASOS = [
    { titulo: "Elegí el evento", texto: "Mirá la agenda y los lugares que quedan para cada partido o show." },
    { titulo: "Reservá tu mesa", texto: `Ingresá con tu cuenta e indicá cuántos van (de ${LIMITES_RESERVA.MIN_PERSONAS} a ${LIMITES_RESERVA.MAX_PERSONAS} personas).` },
    { titulo: "Confirmá y vení", texto: "Si el evento pide seña, abonala dentro de las 24 horas. Llegá hasta 20 minutos después del inicio." }
];
export default function EventosPage() {
    useTituloPagina("Eventos");
    const { datos, cargando, error, recargar } = useRecurso(getEventos);
    const proximos = useMemo(() => obtenerProximosEventos(datos ?? []), [datos]);
    return (
        <div className="contenedor pagina">
            <EncabezadoPagina
                titulo="Eventos y partidos"
                descripcion="Partidos en pantalla gigante y shows en vivo. Reservá tu mesa antes de que se llene."
            />
            <ol className="eventos__pasos" aria-label="Cómo reservar">
                {PASOS.map((paso, indice) => (
                    <li key={paso.titulo} className="eventos__paso">
                        <span className="eventos__numero" aria-hidden="true">{indice + 1}</span>
                        <div>
                            <p className="eventos__paso-titulo">{paso.titulo}</p>
                            <p className="eventos__paso-texto">{paso.texto}</p>
                        </div>
                    </li>
                ))}
            </ol>
            <h2 className="eventos__titulo">Próximos eventos</h2>
            <ListaEventos eventos={proximos} cargando={cargando} error={error} onReintentar={recargar} />
        </div>
    );
}
