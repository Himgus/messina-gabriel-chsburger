import ImagenPendiente from "./ImagenPendiente.jsx";
import Seccion from "./Seccion.jsx";
import { SOBRE_NOSOTROS } from "../data/negocio.js";
import "./SobreNosotros.css";
export default function SobreNosotros() {
    return (
        <Seccion id="nosotros" titulo="Sobre nosotros">
            <div className="nosotros">
                <ImagenPendiente descripcion="foto de la fachada del local de Tucumán 975" className="nosotros__imagen" />
                <div className="nosotros__texto">
                    {SOBRE_NOSOTROS.map((parrafo) => (
                        <p key={parrafo}>{parrafo}</p>
                    ))}
                </div>
            </div>
        </Seccion>
    );
}
