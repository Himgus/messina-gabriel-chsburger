import RedesSociales from "./RedesSociales.jsx";
import { CONTACTO, HORARIOS, SUCURSALES } from "../data/negocio.js";
import "./Footer.css";
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
                    <ul className="footer__lista">
                        {HORARIOS.map((horario) => (
                            <li key={horario.dias}>
                                <strong>{horario.dias}:</strong> {horario.horario}
                            </li>
                        ))}
                    </ul>
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
