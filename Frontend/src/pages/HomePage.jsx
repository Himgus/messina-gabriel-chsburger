import { useMemo } from "react";
import Agenda from "../components/Agenda.jsx";
import Hero from "../components/Hero.jsx";
import ProductosEstrella from "../components/ProductosEstrella.jsx";
import SobreNosotros from "../components/SobreNosotros.jsx";
import { useRecurso } from "../hooks/useRecurso.js";
import { useTituloPagina } from "../hooks/useTituloPagina.js";
import { getEventos } from "../services/eventoService.js";
import { obtenerEventoDestacado, obtenerProximosEventos } from "../utils/eventos.js";
export default function HomePage() {
    useTituloPagina();
    const { datos: eventos, cargando, error, recargar } = useRecurso(getEventos);
    const proximos = useMemo(() => obtenerProximosEventos(eventos ?? []), [eventos]);
    const destacado = useMemo(() => obtenerEventoDestacado(eventos ?? []), [eventos]);
    return (
        <>
            <Hero evento={destacado} cargando={cargando} />
            <Agenda eventos={proximos} cargando={cargando} error={error} onReintentar={recargar} />
            <SobreNosotros />
            <ProductosEstrella />
        </>
    );
}
