import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import EventoDatos from "../components/EventoDatos.jsx";
import Loader from "../components/Loader.jsx";
import MensajeEstado from "../components/MensajeEstado.jsx";
import ReservaForm from "../components/ReservaForm.jsx";
import { useRecurso } from "../hooks/useRecurso.js";
import { useToast } from "../hooks/useToast.js";
import { useTituloPagina } from "../hooks/useTituloPagina.js";
import { getEventoById } from "../services/eventoService.js";
import { getReservaById, updateReserva } from "../services/reservaService.js";
import { reservaAFormulario } from "../utils/validarReserva.js";
const RUTA_LISTADO = "/mis-reservas";
export default function EditarReservaPage() {
    useTituloPagina("Modificar reserva");
    const { id } = useParams();
    const navigate = useNavigate();
    const { mostrarExito, mostrarError } = useToast();
    const cargar = useCallback(async () => {
        const reserva = await getReservaById(id);
        const evento = await getEventoById(reserva.eventoId);
        return { reserva, evento };
    }, [id]);
    const { datos, cargando, error, recargar } = useRecurso(cargar);
    const guardar = async (cambios) => {
        try {
            await updateReserva(id, cambios);
            mostrarExito("Guardamos los cambios de tu reserva.");
            navigate(RUTA_LISTADO);
        } catch (errorGuardado) {
            mostrarError(errorGuardado.message);
        }
    };
    return (
        <div className="contenedor pagina pagina-angosta">
            <EncabezadoPagina
                titulo="Modificar reserva"
                descripcion={datos?.evento.titulo}
                volverA={RUTA_LISTADO}
                textoVolver="Volver a mis reservas"
            />
            {cargando && <Loader mensaje="Cargando la reserva…" />}
            {!cargando && error && (
                <MensajeEstado
                    tipo="error"
                    titulo="No pudimos cargar la reserva"
                    accion={<Button variante="secundario" onClick={recargar}>Reintentar</Button>}
                >
                    <p>{error}</p>
                </MensajeEstado>
            )}
            {!cargando && datos && !datos.reserva.puedeModificarse && (
                <MensajeEstado titulo="Esta reserva ya no se puede modificar">
                    <p>Las reservas se pueden modificar hasta 2 horas antes del evento y mientras estén pendientes o confirmadas.</p>
                </MensajeEstado>
            )}
            {!cargando && datos?.reserva.puedeModificarse && (
                <div className="formulario">
                    <EventoDatos evento={datos.evento} />
                    <ReservaForm
                        valoresIniciales={reservaAFormulario(datos.reserva)}
                        lugaresDisponibles={datos.evento.lugaresDisponibles + datos.reserva.cantidadPersonas}
                        textoBoton="Guardar cambios"
                        onSubmit={guardar}
                        onCancelar={() => navigate(RUTA_LISTADO)}
                    />
                </div>
            )}
        </div>
    );
}
