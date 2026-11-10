import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import EventoForm from "../components/EventoForm.jsx";
import Loader from "../components/Loader.jsx";
import MensajeEstado from "../components/MensajeEstado.jsx";
import { useRecurso } from "../hooks/useRecurso.js";
import { useToast } from "../hooks/useToast.js";
import { useTituloPagina } from "../hooks/useTituloPagina.js";
import { createEvento, getEventoById, updateEvento } from "../services/eventoService.js";
import { eventoAFormulario, VALORES_INICIALES_EVENTO } from "../utils/eventoFormulario.js";
const RUTA_LISTADO = "/admin/eventos";
export default function EventoFormPage() {
    const { id } = useParams();
    const esNuevo = id === undefined;
    const titulo = esNuevo ? "Nuevo evento" : "Editar evento";
    useTituloPagina(titulo);
    const navigate = useNavigate();
    const { mostrarExito, mostrarError } = useToast();
    const cargarEvento = useCallback(() => (esNuevo ? Promise.resolve(null) : getEventoById(id)), [esNuevo, id]);
    const { datos: evento, cargando, error, recargar } = useRecurso(cargarEvento);
    const guardar = async (datos) => {
        try {
            if (esNuevo) {
                await createEvento(datos);
                mostrarExito(`Se creó el evento "${datos.titulo}".`);
            } else {
                await updateEvento(id, datos);
                mostrarExito(`Se guardaron los cambios de "${datos.titulo}".`);
            }
            navigate(RUTA_LISTADO);
        } catch (errorGuardado) {
            mostrarError(errorGuardado.message);
        }
    };
    return (
        <div className="contenedor pagina pagina-formulario">
            <EncabezadoPagina
                titulo={titulo}
                descripcion={esNuevo ? "Completá los datos del partido o evento para sumarlo a la agenda." : evento?.titulo}
                volverA={RUTA_LISTADO}
                textoVolver="Volver al listado"
            />
            {cargando && <Loader mensaje="Cargando el evento…" />}
            {!cargando && error && (
                <MensajeEstado
                    tipo="error"
                    titulo="No pudimos cargar el evento"
                    accion={<Button variante="secundario" onClick={recargar}>Reintentar</Button>}
                >
                    <p>{error}</p>
                </MensajeEstado>
            )}
            {!cargando && !error && (
                <EventoForm
                    key={evento?.id ?? "nuevo"}
                    valoresIniciales={evento ? eventoAFormulario(evento) : VALORES_INICIALES_EVENTO}
                    esNuevo={esNuevo}
                    textoBoton={esNuevo ? "Crear evento" : "Guardar cambios"}
                    onSubmit={guardar}
                    onCancelar={() => navigate(RUTA_LISTADO)}
                />
            )}
        </div>
    );
}
