import Button from "./Button.jsx";
import Loader from "./Loader.jsx";
import MensajeEstado from "./MensajeEstado.jsx";
import ProductoCard from "./ProductoCard.jsx";
import Seccion from "./Seccion.jsx";
import "./ProductosEstrella.css";
function ContenidoProductos({ productos, cargando, error, onReintentar }) {
    if (cargando) {
        return <Loader mensaje="Cargando productos…" claro />;
    }
    if (error) {
        return (
            <MensajeEstado
                tipo="error"
                titulo="No pudimos cargar los productos"
                accion={<Button variante="secundario" onClick={onReintentar}>Reintentar</Button>}
            >
                <p>{error}</p>
            </MensajeEstado>
        );
    }
    if (productos.length === 0) {
        return (
            <MensajeEstado titulo="Pronto vas a ver acá nuestros favoritos">
                <p>Mientras tanto, mirá el menú completo.</p>
            </MensajeEstado>
        );
    }
    return (
        <ul className="productos__lista" role="list">
            {productos.map((producto) => (
                <li key={producto.id}>
                    <ProductoCard producto={producto} />
                </li>
            ))}
        </ul>
    );
}
export default function ProductosEstrella(props) {
    return (
        <Seccion
            id="productos"
            titulo="Productos estrella"
            subtitulo="Los clásicos que nos hicieron famosos."
            variante="oscura"
        >
            <ContenidoProductos {...props} />
            <div className="productos__acciones">
                <Button to="/menu" variante="accion" tamanio="grande" className="productos__cta">
                    Ver el menú completo
                </Button>
            </div>
        </Seccion>
    );
}
