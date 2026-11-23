import { useState } from "react";
import Button from "../components/Button.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import Loader from "../components/Loader.jsx";
import MensajeEstado from "../components/MensajeEstado.jsx";
import MesasTable from "../components/MesasTable.jsx";
import { useRecurso } from "../hooks/useRecurso.js";
import { useToast } from "../hooks/useToast.js";
import { useTituloPagina } from "../hooks/useTituloPagina.js";
import { deleteMesa, getMesas } from "../services/mesaService.js";
export default function AdminMesasPage() {
    useTituloPagina("Mesas");
    const { datos: mesas, cargando, error, recargar, setDatos } = useRecurso(getMesas);
    const [mesaAEliminar, setMesaAEliminar] = useState(null);
    const [eliminando, setEliminando] = useState(false);
    const { mostrarExito, mostrarError } = useToast();
    const confirmarEliminacion = async () => {
        setEliminando(true);
        try {
            await deleteMesa(mesaAEliminar.id);
            setDatos((actuales) => actuales.filter((mesa) => mesa.id !== mesaAEliminar.id));
            mostrarExito(`Se eliminó la mesa ${mesaAEliminar.numero}.`);
            setMesaAEliminar(null);
        } catch (errorEliminacion) {
            mostrarError(errorEliminacion.message);
        } finally {
            setEliminando(false);
        }
    };
    return (
        <div className="contenedor pagina">
            <EncabezadoPagina
                titulo="Mesas"
                descripcion="Gestioná las mesas del salón: sector, capacidad y si están disponibles para asignar a reservas."
            >
                <Button to="/admin/mesas/nueva" variante="accion">+ Nueva mesa</Button>
            </EncabezadoPagina>
            {cargando && <Loader mensaje="Cargando mesas…" />}
            {!cargando && error && (
                <MensajeEstado
                    tipo="error"
                    titulo="No pudimos cargar las mesas"
                    accion={<Button variante="secundario" onClick={recargar}>Reintentar</Button>}
                >
                    <p>{error}</p>
                </MensajeEstado>
            )}
            {!cargando && !error && mesas.length === 0 && (
                <MensajeEstado
                    titulo="No hay mesas cargadas"
                    accion={<Button to="/admin/mesas/nueva" variante="accion">Cargar la primera mesa</Button>}
                >
                    <p>Las mesas se asignan a las reservas confirmadas desde el panel de recepción.</p>
                </MensajeEstado>
            )}
            {!cargando && !error && mesas.length > 0 && <MesasTable mesas={mesas} onEliminar={setMesaAEliminar} />}
            <ConfirmDialog
                abierto={mesaAEliminar !== null}
                titulo="¿Eliminar mesa?"
                cargando={eliminando}
                onConfirmar={confirmarEliminacion}
                onCancelar={() => setMesaAEliminar(null)}
                descripcion={
                    <p>
                        Vas a eliminar la <strong>mesa {mesaAEliminar?.numero}</strong>. Si solo querés dejar de usarla por un tiempo,
                        podés marcarla como inactiva desde Editar.
                    </p>
                }
            />
        </div>
    );
}
