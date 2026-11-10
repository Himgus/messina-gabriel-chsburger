import "./Loader.css";
export default function Loader({ mensaje = "Cargando…", claro = false }) {
    return (
        <div className={`loader${claro ? " loader--claro" : ""}`} role="status">
            <span className="loader__spinner" aria-hidden="true" />
            <span>{mensaje}</span>
        </div>
    );
}
