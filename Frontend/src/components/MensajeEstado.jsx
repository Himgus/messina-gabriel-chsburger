import Icono from "./Icono.jsx";
import "./MensajeEstado.css";
export default function MensajeEstado({ tipo = "vacio", titulo, children, accion }) {
    const esError = tipo === "error";
    return (
        <div className={`mensaje-estado mensaje-estado--${tipo}`} role={esError ? "alert" : undefined}>
            <Icono nombre={esError ? "alerta" : "calendario"} tamanio={40} className="mensaje-estado__icono" />
            <p className="mensaje-estado__titulo">{titulo}</p>
            {children && <div className="mensaje-estado__texto">{children}</div>}
            {accion && <div className="mensaje-estado__accion">{accion}</div>}
        </div>
    );
}
