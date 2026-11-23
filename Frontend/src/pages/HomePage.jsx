import { useMemo } from "react";
import Hero from "../components/Hero.jsx";
import ProductosEstrella from "../components/ProductosEstrella.jsx";
import ProximoEvento from "../components/ProximoEvento.jsx";
import SobreNosotros from "../components/SobreNosotros.jsx";
import { useRecurso } from "../hooks/useRecurso.js";
import { useTituloPagina } from "../hooks/useTituloPagina.js";
import { getEventos } from "../services/eventoService.js";
import { getProductosDestacados } from "../services/productoService.js";
import { CategoriaProducto } from "../utils/constantes.js";
import { obtenerEventoDestacado } from "../utils/eventos.js";
export default function HomePage() {
    useTituloPagina();
    const productos = useRecurso(getProductosDestacados);
    const eventos = useRecurso(getEventos, { notificarErrores: false });
    const destacados = useMemo(() => productos.datos ?? [], [productos.datos]);
    const productoPortada = destacados.find((producto) => producto.categoria === CategoriaProducto.BALDAZO && producto.imagen)
        ?? destacados.find((producto) => producto.imagen);
    const proximoEvento = useMemo(() => obtenerEventoDestacado(eventos.datos ?? []), [eventos.datos]);
    return (
        <>
            <Hero producto={productoPortada} />
            <SobreNosotros />
            <ProductosEstrella
                productos={destacados}
                cargando={productos.cargando}
                error={productos.error}
                onReintentar={productos.recargar}
            />
            <ProximoEvento evento={proximoEvento} cargando={eventos.cargando} />
        </>
    );
}
