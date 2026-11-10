import { Link } from "react-router-dom";
import "./Button.css";
export default function Button({
    variante = "accion",
    tamanio = "normal",
    to,
    href,
    type = "button",
    cargando = false,
    disabled = false,
    className = "",
    children,
    ...props
}) {
    const clases = ["boton", `boton--${variante}`, `boton--${tamanio}`, className].filter(Boolean).join(" ");
    if (to) {
        return (
            <Link to={to} className={clases} {...props}>
                {children}
            </Link>
        );
    }
    if (href) {
        return (
            <a href={href} className={clases} {...props}>
                {children}
            </a>
        );
    }
    return (
        <button type={type} className={clases} disabled={disabled || cargando} aria-busy={cargando || undefined} {...props}>
            {cargando && <span className="boton__spinner" aria-hidden="true" />}
            {children}
        </button>
    );
}
