import { useId } from "react";
import "./FormField.css";
export default function FormField({ label, error, ayuda, as = "input", opciones = [], requerido = false, ...props }) {
    const id = useId();
    const idAyuda = `${id}-ayuda`;
    const idError = `${id}-error`;
    const descripcion = [ayuda && idAyuda, error && idError].filter(Boolean).join(" ") || undefined;
    const atributos = {
        id,
        className: "campo__control",
        "aria-invalid": error ? true : undefined,
        "aria-describedby": descripcion,
        "aria-required": requerido || undefined,
        ...props
    };
    return (
        <div className={`campo${error ? " campo--error" : ""}`}>
            <label htmlFor={id} className="campo__etiqueta">
                {label}
                {requerido && <span className="campo__requerido" aria-hidden="true"> *</span>}
            </label>
            {as === "select" ? (
                <select {...atributos}>
                    {opciones.map((opcion) => (
                        <option key={opcion.valor} value={opcion.valor}>
                            {opcion.etiqueta}
                        </option>
                    ))}
                </select>
            ) : as === "textarea" ? (
                <textarea {...atributos} />
            ) : (
                <input {...atributos} />
            )}
            {ayuda && <p id={idAyuda} className="campo__ayuda">{ayuda}</p>}
            {error && <p id={idError} className="campo__error">{error}</p>}
        </div>
    );
}
