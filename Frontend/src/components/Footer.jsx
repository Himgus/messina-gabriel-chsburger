import { useEffect } from "react";
import RedesSociales from "./RedesSociales.jsx";
import { useRecurso } from "../hooks/useRecurso.js";
import { getConfiguracion } from "../services/configuracionService.js";
import { CONTACTO, SUCURSALES } from "../data/negocio.js";
import { EVENTO_CONFIGURACION_ACTUALIZADA } from "../utils/constantes.js";
import "./Footer.css";
function Horarios() {
    const { datos, cargando, error, recargar } = useRecurso(getConfiguracion, { notificarErrores: false });
    useEffect(() => {
        window.addEventListener(EVENTO_CONFIGURACION_ACTUALIZADA, recargar);
        return () => window.removeEventListener(EVENTO_CONFIGURACION_ACTUALIZADA, recargar);
    }, [recargar]);
    if (cargando) {
        return <p className="footer__aviso">Cargando horarios…</p>;
    }
    if (error) {
        return <p className="footer__aviso">No pudimos cargar los horarios. Consultalos por WhatsApp.</p>;
    }
    return (
        <ul className="footer__lista">
            {datos.horarios.map((franja) => (
                <li key={franja.dias}>
                    <strong>{franja.dias}:</strong> {franja.horario}
                </li>
            ))}
        </ul>
    );
}
export default function Footer() {
    return (
        <footer id="contacto" className="footer">
            <div className="contenedor footer__contenido">
                <div className="footer__columna">
                    <h2 className="footer__titulo">Sucursales</h2>
                    <ul className="footer__lista">
                        {SUCURSALES.map((sucursal) => (
                            <li key={sucursal.nombre}>
                                <strong>{sucursal.nombre}:</strong> {sucursal.direccion}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="footer__columna">
                    <h2 className="footer__titulo">Horarios</h2>
                    <Horarios />
                    <h2 className="footer__titulo">Contacto</h2>
                    <ul className="footer__lista">
                        <li>
                            <a href={`tel:+${CONTACTO.whatsapp}`}>{CONTACTO.telefono}</a>
                        </li>
                        <li>
                            <a href={`mailto:${CONTACTO.email}`}>{CONTACTO.email}</a>
                        </li>
                    </ul>
                </div>
                <div className="footer__columna footer__columna--redes">
                    <h2 className="footer__titulo">Seguinos</h2>
                    <RedesSociales />
                </div>
            </div>
            <p className="footer__legal">© {new Date().getFullYear()} CHS Burger. La casa del Megabaldazo.</p>
        </footer>
    );
}
