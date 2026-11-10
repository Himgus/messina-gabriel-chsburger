import Button from "./Button.jsx";
import ProductoCard from "./ProductoCard.jsx";
import Seccion from "./Seccion.jsx";
import { DELIVERY, PRODUCTOS_ESTRELLA } from "../data/negocio.js";
import "./ProductosEstrella.css";
export default function ProductosEstrella() {
    return (
        <Seccion
            id="productos"
            titulo="Productos estrella"
            subtitulo="Los clásicos que nos hicieron famosos. ¿Preferís comer en casa? Pedilos por delivery."
            variante="oscura"
        >
            <ul className="productos__lista" role="list">
                {PRODUCTOS_ESTRELLA.map((producto) => (
                    <li key={producto.id}>
                        <ProductoCard producto={producto} />
                    </li>
                ))}
            </ul>
            <div className="productos__delivery">
                {DELIVERY.map((app) => (
                    <Button key={app.nombre} href={app.url} variante="principal" target="_blank" rel="noreferrer">
                        Pedí por {app.nombre}
                        <span className="visualmente-oculto"> (se abre en una pestaña nueva)</span>
                    </Button>
                ))}
            </div>
        </Seccion>
    );
}
