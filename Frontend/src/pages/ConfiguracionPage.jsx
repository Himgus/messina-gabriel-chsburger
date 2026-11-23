import { useRef, useState } from "react";
import Button from "../components/Button.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import FormField from "../components/FormField.jsx";
import Loader from "../components/Loader.jsx";
import MensajeEstado from "../components/MensajeEstado.jsx";
import { useRecurso } from "../hooks/useRecurso.js";
import { useToast } from "../hooks/useToast.js";
import { useTituloPagina } from "../hooks/useTituloPagina.js";
import { getConfiguracion, updateConfiguracion } from "../services/configuracionService.js";
import { EVENTO_CONFIGURACION_ACTUALIZADA, LIMITES_CONFIGURACION } from "../utils/constantes.js";
import { validarConfiguracion } from "../utils/validarConfiguracion.js";
import "./ConfiguracionPage.css";
let ultimaClave = 0;
const conClave = (franja) => {
    ultimaClave++;
    return { ...franja, clave: ultimaClave };
};
function ConfiguracionForm({ configuracion }) {
    const [capacidadLocal, setCapacidadLocal] = useState(String(configuracion.capacidadLocal));
    const [horarios, setHorarios] = useState(() => configuracion.horarios.map(conClave));
    const [errores, setErrores] = useState({});
    const [enviando, setEnviando] = useState(false);
    const formulario = useRef(null);
    const { mostrarExito, mostrarError } = useToast();
    const cambiarFranja = (indice, campo, valor) => {
        setHorarios((actuales) => actuales.map((franja, posicion) => (posicion === indice ? { ...franja, [campo]: valor } : franja)));
    };
    const agregarFranja = () => setHorarios((actuales) => [...actuales, conClave({ dias: "", horario: "" })]);
    const quitarFranja = (indice) => {
        setHorarios((actuales) => actuales.filter((_, posicion) => posicion !== indice));
        setErrores({});
    };
    const guardar = async (evento) => {
        evento.preventDefault();
        const resultado = validarConfiguracion({ capacidadLocal, horarios });
        setErrores(resultado);
        const primerCampoConError = Array.from(formulario.current.elements).find((elemento) => elemento.name && resultado[elemento.name]);
        if (primerCampoConError) {
            primerCampoConError.focus();
            mostrarError("Revisá los campos marcados antes de continuar.");
            return;
        }
        setEnviando(true);
        try {
            const guardada = await updateConfiguracion({
                capacidadLocal: Number(capacidadLocal),
                horarios: horarios.map(({ dias, horario }) => ({ dias: dias.trim(), horario: horario.trim() }))
            });
            setHorarios(guardada.horarios.map(conClave));
            window.dispatchEvent(new Event(EVENTO_CONFIGURACION_ACTUALIZADA));
            mostrarExito("Guardamos la configuración del local.");
        } catch (error) {
            mostrarError(error.message);
        } finally {
            setEnviando(false);
        }
    };
    return (
        <form ref={formulario} className="formulario" onSubmit={guardar} noValidate>
            <fieldset className="formulario__grupo">
                <legend className="formulario__leyenda">Salón</legend>
                <FormField
                    type="number"
                    label="Capacidad del local (personas)"
                    name="capacidadLocal"
                    value={capacidadLocal}
                    onChange={(evento) => setCapacidadLocal(evento.target.value)}
                    error={errores.capacidadLocal}
                    min="1"
                    max={LIMITES_CONFIGURACION.CAPACIDAD_MAX}
                    inputMode="numeric"
                    ayuda="Ningún evento puede tener un cupo mayor a esta capacidad."
                    requerido
                />
            </fieldset>
            <fieldset className="formulario__grupo">
                <legend className="formulario__leyenda">Horarios de atención</legend>
                <p className="formulario__aviso">Se muestran en el pie de todas las páginas.</p>
                <ul className="horarios__lista" role="list">
                    {horarios.map((franja, indice) => (
                        <li key={franja.clave} className="horarios__franja">
                            <FormField
                                label={`Días (franja ${indice + 1})`}
                                name={`dias-${indice}`}
                                value={franja.dias}
                                onChange={(evento) => cambiarFranja(indice, "dias", evento.target.value)}
                                error={errores[`dias-${indice}`]}
                                maxLength={LIMITES_CONFIGURACION.TEXTO_HORARIO_MAX}
                                placeholder="Ej.: Lunes a jueves"
                                requerido
                            />
                            <FormField
                                label={`Horario (franja ${indice + 1})`}
                                name={`horario-${indice}`}
                                value={franja.horario}
                                onChange={(evento) => cambiarFranja(indice, "horario", evento.target.value)}
                                error={errores[`horario-${indice}`]}
                                maxLength={LIMITES_CONFIGURACION.TEXTO_HORARIO_MAX}
                                placeholder="Ej.: 12 a 23 h"
                                requerido
                            />
                            <Button
                                variante="peligro"
                                tamanio="chico"
                                className="horarios__quitar"
                                disabled={horarios.length === 1}
                                onClick={() => quitarFranja(indice)}
                            >
                                Quitar<span className="visualmente-oculto"> franja {indice + 1}</span>
                            </Button>
                        </li>
                    ))}
                </ul>
                <div>
                    <Button
                        variante="secundario"
                        tamanio="chico"
                        disabled={horarios.length >= LIMITES_CONFIGURACION.HORARIOS_MAX}
                        onClick={agregarFranja}
                    >
                        + Agregar franja
                    </Button>
                </div>
            </fieldset>
            <div className="formulario__acciones">
                <Button type="submit" variante="accion" cargando={enviando}>
                    {enviando ? "Guardando…" : "Guardar configuración"}
                </Button>
            </div>
        </form>
    );
}
export default function ConfiguracionPage() {
    useTituloPagina("Configuración del local");
    const { datos, cargando, error, recargar } = useRecurso(getConfiguracion);
    return (
        <div className="contenedor pagina pagina-formulario">
            <EncabezadoPagina
                titulo="Configuración del local"
                descripcion="Capacidad del salón y horarios de atención que se muestran a los clientes."
            />
            {cargando && <Loader mensaje="Cargando la configuración…" />}
            {!cargando && error && (
                <MensajeEstado
                    tipo="error"
                    titulo="No pudimos cargar la configuración"
                    accion={<Button variante="secundario" onClick={recargar}>Reintentar</Button>}
                >
                    <p>{error}</p>
                </MensajeEstado>
            )}
            {!cargando && datos && <ConfiguracionForm configuracion={datos} />}
        </div>
    );
}
