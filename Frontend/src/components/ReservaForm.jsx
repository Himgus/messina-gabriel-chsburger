import Button from "./Button.jsx";
import FormField from "./FormField.jsx";
import { useFormulario } from "../hooks/useFormulario.js";
import { LIMITES_RESERVA } from "../utils/constantes.js";
import { formularioAReserva, validarReserva } from "../utils/validarReserva.js";
export default function ReservaForm({ valoresIniciales, lugaresDisponibles, textoBoton, onSubmit, onCancelar }) {
    const { valores, errores, enviando, formulario, handleChange, handleBlur, handleSubmit } = useFormulario({
        valoresIniciales,
        validar: (valoresActuales) => validarReserva(valoresActuales, { lugaresDisponibles }),
        onSubmit: (valoresActuales) => onSubmit(formularioAReserva(valoresActuales))
    });
    const caracteresRestantes = LIMITES_RESERVA.OBSERVACIONES_MAX - valores.observaciones.length;
    return (
        <form ref={formulario} className="formulario formulario--compacto" onSubmit={handleSubmit} noValidate>
            <FormField
                type="number"
                label="Cantidad de personas"
                name="cantidadPersonas"
                value={valores.cantidadPersonas}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errores.cantidadPersonas}
                min={LIMITES_RESERVA.MIN_PERSONAS}
                max={LIMITES_RESERVA.MAX_PERSONAS}
                step="1"
                inputMode="numeric"
                ayuda={`De ${LIMITES_RESERVA.MIN_PERSONAS} a ${LIMITES_RESERVA.MAX_PERSONAS} personas.`}
                requerido
            />
            <FormField
                as="textarea"
                label="Observaciones"
                name="observaciones"
                value={valores.observaciones}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errores.observaciones}
                maxLength={LIMITES_RESERVA.OBSERVACIONES_MAX}
                placeholder="Ej.: cumpleaños, silla para bebé…"
                ayuda={`Opcional. Te quedan ${caracteresRestantes} caracteres.`}
            />
            <div className="formulario__acciones">
                {onCancelar && (
                    <Button variante="secundario" onClick={onCancelar} disabled={enviando}>
                        Cancelar
                    </Button>
                )}
                <Button type="submit" variante="accion" cargando={enviando}>
                    {enviando ? "Guardando…" : textoBoton}
                </Button>
            </div>
        </form>
    );
}
