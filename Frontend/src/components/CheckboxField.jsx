import { useId } from "react";
import "./FormField.css";
export default function CheckboxField({ label, ayuda, ...props }) {
    const id = useId();
    const idAyuda = `${id}-ayuda`;
    return (
        <div className="campo campo--checkbox">
            <input id={id} type="checkbox" className="campo__checkbox" aria-describedby={ayuda ? idAyuda : undefined} {...props} />
            <div>
                <label htmlFor={id} className="campo__etiqueta">{label}</label>
                {ayuda && <p id={idAyuda} className="campo__ayuda">{ayuda}</p>}
            </div>
        </div>
    );
}
