import "./ImagenPendiente.css";
export default function ImagenPendiente({ descripcion, className = "" }) {
    return (
        <div className={`imagen-pendiente ${className}`} role="img" aria-label={`Espacio para imagen: ${descripcion}`}>
            <svg className="imagen-pendiente__cruz" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                <line x1="0" y1="0" x2="100" y2="100" />
                <line x1="100" y1="0" x2="0" y2="100" />
            </svg>
        </div>
    );
}
