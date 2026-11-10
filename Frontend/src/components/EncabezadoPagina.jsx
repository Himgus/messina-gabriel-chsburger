import { Link } from "react-router-dom";
import Icono from "./Icono.jsx";
import "./EncabezadoPagina.css";
export default function EncabezadoPagina({ titulo, descripcion, volverA, textoVolver = "Volver", children }) {
    return (
        <header className="encabezado-pagina">
            {volverA && (
                <Link to={volverA} className="encabezado-pagina__volver">
                    <Icono nombre="flecha" tamanio={18} />
                    {textoVolver}
                </Link>
            )}
            <div className="encabezado-pagina__fila">
                <div>
                    <h1 className="encabezado-pagina__titulo">{titulo}</h1>
                    {descripcion && <p className="encabezado-pagina__descripcion">{descripcion}</p>}
                </div>
                {children && <div className="encabezado-pagina__acciones">{children}</div>}
            </div>
        </header>
    );
}
