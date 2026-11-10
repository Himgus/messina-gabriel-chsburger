import { useEffect } from "react";
const NOMBRE_SITIO = "CHS Burger";
export function useTituloPagina(titulo) {
    useEffect(() => {
        document.title = titulo ? `${titulo} | ${NOMBRE_SITIO}` : `${NOMBRE_SITIO} | La casa del Megabaldazo`;
    }, [titulo]);
}
