import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import CheckboxField from "../components/CheckboxField.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import FormField from "../components/FormField.jsx";
import Loader from "../components/Loader.jsx";
import MensajeEstado from "../components/MensajeEstado.jsx";
import { useFormulario } from "../hooks/useFormulario.js";
import { useRecurso } from "../hooks/useRecurso.js";
import { useToast } from "../hooks/useToast.js";
import { useTituloPagina } from "../hooks/useTituloPagina.js";
import { createMesa, getMesaById, updateMesa } from "../services/mesaService.js";
import { ETIQUETAS_SECTOR, LIMITES_MESA } from "../utils/constantes.js";
import { formularioAMesa, mesaAFormulario, validarMesa, VALORES_INICIALES_MESA } from "../utils/validarMesa.js";
const RUTA_LISTADO = "/admin/mesas";
const OPCIONES_SECTOR = Object.entries(ETIQUETAS_SECTOR).map(([valor, etiqueta]) => ({ valor, etiqueta }));
function MesaForm({ valoresIniciales, textoBoton, onSubmit, onCancelar }) {
    const { valores, errores, enviando, formulario, handleChange, handleBlur, handleSubmit } = useFormulario({
        valoresIniciales,
        validar: validarMesa,
        onSubmit: (valoresActuales) => onSubmit(formularioAMesa(valoresActuales))
    });
    return (
        <form ref={formulario} className="formulario" onSubmit={handleSubmit} noValidate>
            <div className="formulario__fila">
                <FormField
                    type="number"
                    label="Número de mesa"
                    name="numero"
                    value={valores.numero}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errores.numero}
                    min="1"
                    max={LIMITES_MESA.NUMERO_MAX}
                    inputMode="numeric"
                    requerido
                />
                <FormField
                    type="number"
                    label="Capacidad (personas)"
                    name="capacidad"
                    value={valores.capacidad}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errores.capacidad}
                    min="1"
                    max={LIMITES_MESA.CAPACIDAD_MAX}
                    inputMode="numeric"
                    requerido
                />
            </div>
            <FormField
                as="select"
                label="Sector"
                name="sector"
                value={valores.sector}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errores.sector}
                opciones={OPCIONES_SECTOR}
                requerido
            />
            <CheckboxField
                label="Mesa activa"
                name="activa"
                checked={valores.activa}
                onChange={handleChange}
                ayuda="Solo las mesas activas se pueden asignar a reservas."
            />
            <div className="formulario__acciones">
                <Button variante="secundario" onClick={onCancelar} disabled={enviando}>Cancelar</Button>
                <Button type="submit" variante="accion" cargando={enviando}>
                    {enviando ? "Guardando…" : textoBoton}
                </Button>
            </div>
        </form>
    );
}
export default function MesaFormPage() {
    const { id } = useParams();
    const esNueva = id === undefined;
    const titulo = esNueva ? "Nueva mesa" : "Editar mesa";
    useTituloPagina(titulo);
    const navigate = useNavigate();
    const { mostrarExito, mostrarError } = useToast();
    const cargarMesa = useCallback(() => (esNueva ? Promise.resolve(null) : getMesaById(id)), [esNueva, id]);
    const { datos: mesa, cargando, error, recargar } = useRecurso(cargarMesa);
    const guardar = async (datos) => {
        try {
            if (esNueva) {
                await createMesa(datos);
                mostrarExito(`Se creó la mesa ${datos.numero}.`);
            } else {
                await updateMesa(id, datos);
                mostrarExito(`Se guardaron los cambios de la mesa ${datos.numero}.`);
            }
            navigate(RUTA_LISTADO);
        } catch (errorGuardado) {
            mostrarError(errorGuardado.message);
        }
    };
    return (
        <div className="contenedor pagina pagina-angosta">
            <EncabezadoPagina
                titulo={titulo}
                descripcion={mesa ? `Mesa ${mesa.numero} · ${mesa.reservasActivas} reservas activas` : "Completá los datos de la mesa."}
                volverA={RUTA_LISTADO}
                textoVolver="Volver a mesas"
            />
            {cargando && <Loader mensaje="Cargando la mesa…" />}
            {!cargando && error && (
                <MensajeEstado
                    tipo="error"
                    titulo="No pudimos cargar la mesa"
                    accion={<Button variante="secundario" onClick={recargar}>Reintentar</Button>}
                >
                    <p>{error}</p>
                </MensajeEstado>
            )}
            {!cargando && !error && (
                <MesaForm
                    key={mesa?.id ?? "nueva"}
                    valoresIniciales={mesa ? mesaAFormulario(mesa) : VALORES_INICIALES_MESA}
                    textoBoton={esNueva ? "Crear mesa" : "Guardar cambios"}
                    onSubmit={guardar}
                    onCancelar={() => navigate(RUTA_LISTADO)}
                />
            )}
        </div>
    );
}
