import Seccion from "./Seccion.jsx";
import { urlArchivo } from "../services/api.js";
import { IMAGEN_SOBRE_NOSOTROS, SOBRE_NOSOTROS } from "../data/negocio.js";
import "./SobreNosotros.css";
export default function SobreNosotros() {
    return (
        <Seccion id="nosotros" titulo="Sobre nosotros">
            <div className="nosotros">
                <img
                    src={urlArchivo(IMAGEN_SOBRE_NOSOTROS.ruta)}
                    alt={IMAGEN_SOBRE_NOSOTROS.descripcion}
                    className="nosotros__imagen"
                    width="397"
                    height="298"
                    loading="lazy"
                />
                <div className="nosotros__texto">
                    {SOBRE_NOSOTROS.map((parrafo) => (
                        <p key={parrafo}>{parrafo}</p>
                    ))}
                </div>
            </div>
        </Seccion>
    );
}
