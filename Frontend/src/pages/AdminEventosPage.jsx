import { useMemo, useState } from "react";
import Button from "../components/Button.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import EventosTable from "../components/EventosTable.jsx";
import Loader from "../components/Loader.jsx";
import MensajeEstado from "../components/MensajeEstado.jsx";
import { useRecurso } from "../hooks/useRecurso.js";
import { useToast } from "../hooks/useToast.js";
import { useTituloPagina } from "../hooks/useTituloPagina.js";
import { deleteEvento, getEventos } from "../services/eventoService.js";
import { ordenarPorFecha } from "../utils/eventos.js";
export default function AdminEventosPage() {
    useTituloPagina("Administrar eventos");
    const { datos, cargando, error, recargar, setDatos } = useRecurso(getEventos);
    const [eventoAEliminar, setEventoAEliminar] = useState(null);
    const [eliminando, setEliminando] = useState(false);
    const { mostrarExito, mostrarError } = useToast();
    const eventos = useMemo(() => ordenarPorFecha(datos ?? []), [datos]);
    const confirmarEliminacion = async () => {
        setEliminando(true);
        try {
            await deleteEvento(eventoAEliminar.id);
            setDatos((actuales) => actuales.filter((evento) => evento.id !== eventoAEliminar.id));
            mostrarExito(`Se eliminó el evento "${eventoAEliminar.titulo}".`);
            setEventoAEliminar(null);
        } catch (errorEliminacion) {
            mostrarError(errorEliminacion.message);
        } finally {
            setEliminando(false);
        }
    };
    return (
        <div className="contenedor pagina">
            <EncabezadoPagina
                titulo="Administrar eventos"
                descripcion="Cargá, editá o eliminá los partidos y eventos que se muestran en la agenda."
            >
                <Button to="/admin/eventos/nuevo" variante="accion">+ Nuevo evento</Button>
            </EncabezadoPagina>
            {cargando && <Loader mensaje="Cargando eventos…" />}
            {!cargando && error && (
                <MensajeEstado
                    tipo="error"
                    titulo="No pudimos cargar los eventos"
                    accion={<Button variante="secundario" onClick={recargar}>Reintentar</Button>}
                >
                    <p>{error}</p>
                </MensajeEstado>
            )}
            {!cargando && !error && eventos.length === 0 && (
                <MensajeEstado
                    titulo="No hay eventos cargados"
                    accion={<Button to="/admin/eventos/nuevo" variante="accion">Crear el primer evento</Button>}
                >
                    <p>Cuando cargues un evento va a aparecer en la agenda de la página principal.</p>
                </MensajeEstado>
            )}
            {!cargando && !error && eventos.length > 0 && (
                <EventosTable eventos={eventos} onEliminar={setEventoAEliminar} />
            )}
            <ConfirmDialog
                abierto={eventoAEliminar !== null}
                titulo="¿Eliminar evento?"
                cargando={eliminando}
                onConfirmar={confirmarEliminacion}
                onCancelar={() => setEventoAEliminar(null)}
                descripcion={
                    <p>
                        Vas a eliminar <strong>{eventoAEliminar?.titulo}</strong>. Esta acción no se puede deshacer.
                    </p>
                }
            />
        </div>
    );
}
