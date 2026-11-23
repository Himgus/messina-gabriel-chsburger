import Etiqueta from "./Etiqueta.jsx";
import ImagenPendiente from "./ImagenPendiente.jsx";
import { urlArchivo } from "../services/api.js";
import { formatearMoneda } from "../utils/formatters.js";
import "./ProductoCard.css";
export default function ProductoCard({ producto, nivelTitulo = 3 }) {
    const Titulo = `h${nivelTitulo}`;
    return (
        <article className={`producto-card${producto.disponible ? "" : " producto-card--agotado"}`}>
            <div className="producto-card__imagen">
                {producto.imagen ? (
                    <img src={urlArchivo(producto.imagen)} alt={producto.nombre} loading="lazy" />
                ) : (
                    <ImagenPendiente descripcion={`foto de ${producto.nombre}`} className="producto-card__sin-imagen" />
                )}
                {!producto.disponible && (
                    <span className="producto-card__agotado">
                        <Etiqueta variante="acento">Agotado</Etiqueta>
                    </span>
                )}
            </div>
            <div className="producto-card__cuerpo">
                <div className="producto-card__encabezado">
                    <Titulo className="producto-card__nombre">{producto.nombre}</Titulo>
                    <p className="producto-card__precio">{formatearMoneda(producto.precio)}</p>
                </div>
                {producto.descripcion && <p className="producto-card__descripcion">{producto.descripcion}</p>}
                {producto.opciones.length > 0 && (
                    <ul className="producto-card__opciones" aria-label={`Opciones de ${producto.nombre}`}>
                        {producto.opciones.map((opcion) => (
                            <li key={opcion.nombre} className="producto-card__opcion">
                                {opcion.nombre}
                                <strong>{opcion.adicional ? "+ " : ""}{formatearMoneda(opcion.precio)}</strong>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </article>
    );
}
