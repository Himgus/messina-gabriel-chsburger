import ImagenPendiente from "./ImagenPendiente.jsx";
import "./ProductoCard.css";
export default function ProductoCard({ producto }) {
    return (
        <article className="producto-card">
            {producto.imagen ? (
                <img src={producto.imagen} alt={producto.descripcionImagen} className="producto-card__imagen" width="200" height="200" />
            ) : (
                <ImagenPendiente descripcion={producto.descripcionImagen} className="producto-card__imagen" />
            )}
            <h3 className="producto-card__nombre">{producto.nombre}</h3>
            <p className="producto-card__descripcion">{producto.descripcion}</p>
        </article>
    );
}
