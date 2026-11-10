import Icono from "./Icono.jsx";
import "./ToastContainer.css";
const TITULOS = {
    exito: "Listo",
    error: "Error"
};
export default function ToastContainer({ toasts, onCerrar }) {
    return (
        <section className="toasts" aria-label="Notificaciones">
            <ul className="toasts__lista" aria-live="polite">
                {toasts.map((toast) => (
                    <li key={toast.id} className={`toast toast--${toast.tipo}`}>
                        <Icono nombre={toast.tipo === "exito" ? "check" : "alerta"} tamanio={24} className="toast__icono" />
                        <div className="toast__cuerpo">
                            <p className="toast__titulo">{TITULOS[toast.tipo]}</p>
                            <p className="toast__mensaje">{toast.mensaje}</p>
                        </div>
                        <button type="button" className="toast__cerrar" onClick={() => onCerrar(toast.id)} aria-label="Cerrar notificación">
                            <Icono nombre="cerrar" tamanio={18} />
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}
