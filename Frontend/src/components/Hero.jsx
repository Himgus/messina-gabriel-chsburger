import Button from "./Button.jsx";
import ImagenPendiente from "./ImagenPendiente.jsx";
import { urlArchivo } from "../services/api.js";
import "./Hero.css";
export default function Hero({ producto }) {
    return (
        <section className="hero" aria-labelledby="hero-titulo">
            <div className="contenedor hero__contenido">
                <div className="hero__imagen">
                    {producto?.imagen ? (
                        <img src={urlArchivo(producto.imagen)} alt={`${producto.nombre}: ${producto.descripcion}`} />
                    ) : (
                        <ImagenPendiente descripcion="foto del Megabaldazo" className="hero__sin-imagen" />
                    )}
                </div>
                <div className="hero__info">
                    <p className="hero__antetitulo">La casa del Megabaldazo</p>
                    <h1 id="hero-titulo" className="hero__titulo">Hamburguesas ahumadas y baldes para compartir</h1>
                    <span className="hero__linea" aria-hidden="true" />
                    <p className="hero__texto">
                        Carnes ahumadas, salsa CHS y el balde más viral de Buenos Aires. Vení a comer o a ver el partido
                        en nuestras pantallas.
                    </p>
                    <div className="hero__acciones">
                        <Button to="/menu" variante="accion" tamanio="grande" className="hero__cta">
                            Ver el menú
                        </Button>
                        <Button to="/eventos" variante="principal" tamanio="grande">
                            Reservá para el partido
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
