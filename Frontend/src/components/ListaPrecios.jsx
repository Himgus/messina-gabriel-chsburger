import Etiqueta from "./Etiqueta.jsx";
import { formatearMoneda } from "../utils/formatters.js";
import "./ListaPrecios.css";
export default function ListaPrecios({ productos }) {
    return (
        <ul className="lista-precios">
            {productos.map((producto) => (
                <li key={producto.id} className={`lista-precios__item${producto.disponible ? "" : " lista-precios__item--agotado"}`}>
                    <span className="lista-precios__nombre">
                        {producto.nombre}
                        {!producto.disponible && <Etiqueta variante="acento">Agotado</Etiqueta>}
                    </span>
                    <span className="lista-precios__puntos" aria-hidden="true" />
                    <strong className="lista-precios__precio">{formatearMoneda(producto.precio)}</strong>
                </li>
            ))}
        </ul>
    );
}
