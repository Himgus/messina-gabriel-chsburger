import "./Etiqueta.css";
export default function Etiqueta({ variante = "neutra", children }) {
    return <span className={`etiqueta etiqueta--${variante}`}>{children}</span>;
}
