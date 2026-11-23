import { useMemo, useState } from "react";
import Button from "../components/Button.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import Loader from "../components/Loader.jsx";
import MensajeEstado from "../components/MensajeEstado.jsx";
import ReservaCard from "../components/ReservaCard.jsx";
import { useRecurso } from "../hooks/useRecurso.js";
import { useToast } from "../hooks/useToast.js";
import { useTituloPagina } from "../hooks/useTituloPagina.js";
import { cancelarReserva, getMisReservas } from "../services/reservaService.js";
import { ESTADOS_ACTIVOS } from "../utils/constantes.js";
import "./MisReservasPage.css";
function ListaReservas({ titulo, reservas, onCancelar }) {
    return (
        <section className="mis-reservas__grupo" aria-labelledby={`grupo-${titulo}`}>
            <h2 id={`grupo-${titulo}`} className="mis-reservas__titulo">{titulo}</h2>
            <ul className="grilla" role="list">
                {reservas.map((reserva) => (
                    <li key={reserva.id}>
                        <ReservaCard reserva={reserva} onCancelar={onCancelar} />
                    </li>
                ))}
            </ul>
        </section>
    );
}
export default function MisReservasPage() {
    useTituloPagina("Mis reservas");
    const { datos, cargando, error, recargar, setDatos } = useRecurso(getMisReservas);
    const [reservaACancelar, setReservaACancelar] = useState(null);
    const [cancelando, setCancelando] = useState(false);
    const { mostrarExito, mostrarError } = useToast();
    const { activas, historial } = useMemo(() => {
        const reservas = datos ?? [];
        return {
            activas: reservas.filter((reserva) => ESTADOS_ACTIVOS.includes(reserva.estado)),
            historial: reservas.filter((reserva) => !ESTADOS_ACTIVOS.includes(reserva.estado))
        };
    }, [datos]);
    const confirmarCancelacion = async () => {
        setCancelando(true);
        try {
            const actualizada = await cancelarReserva(reservaACancelar.id);
            setDatos((actuales) => actuales.map((reserva) => (reserva.id === actualizada.id ? actualizada : reserva)));
            mostrarExito("Cancelaste la reserva. El lugar quedó liberado.");
            setReservaACancelar(null);
        } catch (errorCancelacion) {
            mostrarError(errorCancelacion.message);
        } finally {
            setCancelando(false);
        }
    };
    return (
        <div className="contenedor pagina">
            <EncabezadoPagina
                titulo="Mis reservas"
                descripcion="Consultá el estado de tus reservas. Podés modificarlas o cancelarlas hasta 2 horas antes del evento."
            >
                <Button to="/eventos" variante="accion">Nueva reserva</Button>
            </EncabezadoPagina>
            {cargando && <Loader mensaje="Cargando tus reservas…" />}
            {!cargando && error && (
                <MensajeEstado
                    tipo="error"
                    titulo="No pudimos cargar tus reservas"
                    accion={<Button variante="secundario" onClick={recargar}>Reintentar</Button>}
                >
                    <p>{error}</p>
                </MensajeEstado>
            )}
            {!cargando && !error && datos.length === 0 && (
                <MensajeEstado
                    titulo="Todavía no tenés reservas"
                    accion={<Button to="/eventos" variante="accion">Ver los eventos</Button>}
                >
                    <p>Elegí un partido o evento de la agenda y reservá tu mesa.</p>
                </MensajeEstado>
            )}
            {!cargando && !error && datos.length > 0 && (
                <>
                    {activas.length > 0 ? (
                        <ListaReservas titulo="Próximas" reservas={activas} onCancelar={setReservaACancelar} />
                    ) : (
                        <MensajeEstado titulo="No tenés reservas activas">
                            <p>Mirá la agenda para reservar en el próximo evento.</p>
                        </MensajeEstado>
                    )}
                    {historial.length > 0 && (
                        <ListaReservas titulo="Historial" reservas={historial} onCancelar={setReservaACancelar} />
                    )}
                </>
            )}
            <ConfirmDialog
                abierto={reservaACancelar !== null}
                titulo="¿Cancelar reserva?"
                textoConfirmar="Cancelar reserva"
                textoCargando="Cancelando…"
                cargando={cancelando}
                onConfirmar={confirmarCancelacion}
                onCancelar={() => setReservaACancelar(null)}
                descripcion={
                    <p>
                        Vas a cancelar tu reserva para <strong>{reservaACancelar?.evento?.titulo}</strong>.
                        El lugar se libera para otra persona y no se puede deshacer.
                    </p>
                }
            />
        </div>
    );
}
