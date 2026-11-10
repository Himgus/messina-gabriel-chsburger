import Button from "./Button.jsx";
import CheckboxField from "./CheckboxField.jsx";
import FormField from "./FormField.jsx";
import { useFormulario } from "../hooks/useFormulario.js";
import { ETIQUETAS_TIPO_EVENTO, LIMITES_EVENTO } from "../utils/constantes.js";
import { formularioAEvento } from "../utils/eventoFormulario.js";
import { aInputFechaHora } from "../utils/fechas.js";
import { validarEvento } from "../utils/validarEvento.js";
const OPCIONES_TIPO = Object.entries(ETIQUETAS_TIPO_EVENTO).map(([valor, etiqueta]) => ({ valor, etiqueta }));
export default function EventoForm({ valoresIniciales, esNuevo, textoBoton, onSubmit, onCancelar }) {
    const { valores, errores, enviando, formulario, handleChange, handleBlur, handleSubmit } = useFormulario({
        valoresIniciales,
        validar: (valoresActuales) => validarEvento(valoresActuales, { esNuevo }),
        onSubmit: (valoresActuales) => onSubmit(formularioAEvento(valoresActuales))
    });
    return (
        <form ref={formulario} className="formulario" onSubmit={handleSubmit} noValidate>
            <p className="formulario__aviso">
                Los campos marcados con <span aria-hidden="true">*</span> son obligatorios.
            </p>
            <fieldset className="formulario__grupo">
                <legend className="formulario__leyenda">Datos del evento</legend>
                <div className="formulario__fila formulario__fila--completa">
                    <FormField
                        label="Título"
                        name="titulo"
                        value={valores.titulo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errores.titulo}
                        maxLength={LIMITES_EVENTO.TITULO_MAX}
                        placeholder="Ej.: Boca vs. River"
                        requerido
                    />
                </div>
                <div className="formulario__fila">
                    <FormField
                        as="select"
                        label="Tipo de evento"
                        name="tipo"
                        value={valores.tipo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errores.tipo}
                        opciones={OPCIONES_TIPO}
                        requerido
                    />
                    <FormField
                        label="Competencia"
                        name="competencia"
                        value={valores.competencia}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errores.competencia}
                        maxLength={LIMITES_EVENTO.COMPETENCIA_MAX}
                        placeholder="Ej.: Liga Profesional"
                        ayuda="Opcional. Dejalo vacío si es un show o un turno común."
                    />
                </div>
                <div className="formulario__fila">
                    <FormField
                        type="datetime-local"
                        label="Fecha y hora"
                        name="fechaHora"
                        value={valores.fechaHora}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errores.fechaHora}
                        min={esNuevo ? aInputFechaHora(new Date()) : undefined}
                        requerido
                    />
                    <FormField
                        type="number"
                        label="Cupo (personas)"
                        name="cupo"
                        value={valores.cupo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errores.cupo}
                        min="1"
                        max={LIMITES_EVENTO.CUPO_MAX}
                        step="1"
                        inputMode="numeric"
                        ayuda={`Máximo ${LIMITES_EVENTO.CUPO_MAX} personas.`}
                        requerido
                    />
                </div>
            </fieldset>
            <fieldset className="formulario__grupo">
                <legend className="formulario__leyenda">Seña y visibilidad</legend>
                <CheckboxField
                    label="Requiere seña"
                    name="requiereSenia"
                    checked={valores.requiereSenia}
                    onChange={handleChange}
                    ayuda="La reserva queda pendiente hasta que el local registra la seña."
                />
                {valores.requiereSenia && (
                    <div className="formulario__fila">
                        <FormField
                            type="number"
                            label="Monto de la seña ($)"
                            name="montoSenia"
                            value={valores.montoSenia}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errores.montoSenia}
                            min="1"
                            step="1"
                            inputMode="numeric"
                            requerido
                        />
                    </div>
                )}
                <CheckboxField
                    label="Destacar en la portada"
                    name="destacado"
                    checked={valores.destacado}
                    onChange={handleChange}
                    ayuda="Se muestra en la portada si es el próximo evento destacado."
                />
                <CheckboxField
                    label="Visible en la agenda"
                    name="activo"
                    checked={valores.activo}
                    onChange={handleChange}
                    ayuda="Si lo desmarcás, el evento queda oculto para los clientes."
                />
            </fieldset>
            <div className="formulario__acciones">
                <Button variante="secundario" onClick={onCancelar} disabled={enviando}>
                    Cancelar
                </Button>
                <Button type="submit" variante="accion" cargando={enviando}>
                    {enviando ? "Guardando…" : textoBoton}
                </Button>
            </div>
        </form>
    );
}
