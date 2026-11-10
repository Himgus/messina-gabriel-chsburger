import Icono from "./Icono.jsx";
import { REDES } from "../data/negocio.js";
import "./RedesSociales.css";
export default function RedesSociales() {
    return (
        <ul className="redes" aria-label="Redes sociales">
            {REDES.map((red) => (
                <li key={red.id}>
                    <a href={red.url} className="redes__enlace" target="_blank" rel="noreferrer">
                        <Icono nombre={red.id} tamanio={24} />
                        <span className="visualmente-oculto">{red.nombre} (se abre en una pestaña nueva)</span>
                    </a>
                </li>
            ))}
        </ul>
    );
}
