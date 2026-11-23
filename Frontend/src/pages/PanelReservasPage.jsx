import { useCallback, useMemo, useState } from "react";
import Button from "../components/Button.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import FormField from "../components/FormField.jsx";
import ListaDatos from "../components/ListaDatos.jsx";
import Loader from "../components/Loader.jsx";
import MensajeEstado from "../components/MensajeEstado.jsx";
import ReservasTable from "../components/ReservasTable.jsx";
import { useRecurso } from "../hooks/useRecurso.js";
import { useToast } from "../hooks/useToast.js";
import { useTituloPagina } from "../hooks/useTituloPagina.js";
import { getEventos } from "../services/eventoService.js";
import { getMesas } from "../services/mesaService.js";
import {
    asignarMesa,
    cancelarReserva,
    finalizarReserva,
    getReservas,
    hacerCheckIn,
    marcarAusente,
    registrarSenia
} from "../services/reservaService.js";
import { ESTADOS_ACTIVOS, ETIQUETAS_ESTADO_RESERVA, LIMITES_RESERVA } from "../utils/constantes.js";
import { ordenarPorFecha } from "../utils/eventos.js";
import { formatearFechaHora } from "../utils/formatters.js";
import "./PanelReservasPage.css";
const HORAS_EVENTO_EN_CURSO = 4;
const ACCIONES = {
    senia: { ejecutar: registrarSenia, exito: "Seña registrada: la reserva quedó confirmada." },
    checkIn: { ejecutar: hacerCheckIn, exito: "Check-in registrado: el cliente ya está en su mesa." },
    finalizar: { ejecutar: finalizarReserva, exito: "Reserva finalizada. La mesa quedó libre." },
    ausente: { ejecutar: marcarAusente, exito: "Se marcó la reserva como \"No se presentó\"." },
    cancelar: { ejecutar: (id, motivo) => cancelarReserva(id, motivo), exito: "Reserva cancelada. El lugar quedó liberado." }
};
const ACCIONES_CON_CONFIRMACION = ["ausente", "cancelar"];
const OPCIONES_FILTRO = [
    { valor: "activas", etiqueta: "Solo activas" },
    { valor: "todas", etiqueta: "Todas" },
    ...Object.entries(ETIQUETAS_ESTADO_RESERVA).map(([valor, etiqueta]) => ({ valor, etiqueta }))
];
const elegirEventoInicial = (eventos) => {
    const limite = Date.now() - HORAS_EVENTO_EN_CURSO * 60 * 60 * 1000;
    const proximo = eventos.find((evento) => new Date(evento.fechaHora).getTime() > limite);
    return proximo ?? eventos[eventos.length - 1];
};
function SeccionReservas({ evento }) {
    const [filtro, setFiltro] = useState("activas");
    const [accionEnCurso, setAccionEnCurso] = useState(null);
    const [confirmacion, setConfirmacion] = useState(null);
    const [motivo, setMotivo] = useState("");
    const [errorMotivo, setErrorMotivo] = useState("");
    const { mostrarExito, mostrarError } = useToast();
    const cargarReservas = useCallback(() => getReservas({ eventoId: evento.id }), [evento.id]);
    const { datos, cargando, error, recargar, setDatos } = useRecurso(cargarReservas);
    const { datos: mesas } = useRecurso(getMesas);
    const reservas = useMemo(() => datos ?? [], [datos]);
    const visibles = reservas.filter((reserva) => {
        if (filtro === "todas") {
            return true;
        }
        if (filtro === "activas") {
            return ESTADOS_ACTIVOS.includes(reserva.estado);
        }
        return reserva.estado === filtro;
    });
    const personasActivas = reservas
        .filter((reserva) => ESTADOS_ACTIVOS.includes(reserva.estado))
        .reduce((total, reserva) => total + reserva.cantidadPersonas, 0);
    const reemplazar = (actualizada) => {
        setDatos((actuales) => actuales.map((reserva) => (reserva.id === actualizada.id ? actualizada : reserva)));
    };
    const ejecutar = async (accion, reserva, motivoCancelacion) => {
        setAccionEnCurso(reserva.id);
        try {
            reemplazar(await ACCIONES[accion].ejecutar(reserva.id, motivoCancelacion));
            mostrarExito(ACCIONES[accion].exito);
            return true;
        } catch (errorAccion) {
            mostrarError(errorAccion.message);
            return false;
        } finally {
            setAccionEnCurso(null);
        }
    };
    const solicitarAccion = (accion, reserva) => {
        if (ACCIONES_CON_CONFIRMACION.includes(accion)) {
            setMotivo("");
            setErrorMotivo("");
            setConfirmacion({ accion, reserva });
            return;
        }
        ejecutar(accion, reserva);
    };
    const confirmar = async () => {
        const esCancelacion = confirmacion.accion === "cancelar";
        if (esCancelacion && !motivo.trim()) {
            setErrorMotivo("Indicá el motivo de la cancelación.");
            return;
        }
        const exito = await ejecutar(confirmacion.accion, confirmacion.reserva, esCancelacion ? motivo.trim() : undefined);
        if (exito) {
            setConfirmacion(null);
        }
    };
    const actualizarMesa = async (reserva, mesaId) => {
        setAccionEnCurso(reserva.id);
        try {
            reemplazar(await asignarMesa(reserva.id, mesaId));
            mostrarExito(`Se asignó la mesa a ${reserva.cliente.nombre} ${reserva.cliente.apellido}.`);
        } catch (errorMesa) {
            mostrarError(errorMesa.message);
        } finally {
            setAccionEnCurso(null);
        }
    };
    const nombreCliente = confirmacion
        ? `${confirmacion.reserva.cliente.nombre} ${confirmacion.reserva.cliente.apellido}`
        : "";
    return (
        <>
            <ListaDatos
                variante="destacado"
                items={[
                    { icono: "calendario", etiqueta: "Fecha y hora", valor: formatearFechaHora(evento.fechaHora) },
                    { icono: "personas", etiqueta: "Personas reservadas", valor: `${personasActivas} de ${evento.cupo}` },
                    { icono: "check", etiqueta: "Lugares libres", valor: Math.max(evento.cupo - personasActivas, 0) },
                    { icono: "trofeo", etiqueta: "Reservas activas", valor: reservas.filter((reserva) => ESTADOS_ACTIVOS.includes(reserva.estado)).length }
                ]}
            />
            <div className="panel-reservas__filtros">
                <FormField
                    as="select"
                    label="Mostrar"
                    name="filtro"
                    value={filtro}
                    onChange={(evento) => setFiltro(evento.target.value)}
                    opciones={OPCIONES_FILTRO}
                />
            </div>
            {cargando && <Loader mensaje="Cargando reservas…" />}
            {!cargando && error && (
                <MensajeEstado
                    tipo="error"
                    titulo="No pudimos cargar las reservas"
                    accion={<Button variante="secundario" onClick={recargar}>Reintentar</Button>}
                >
                    <p>{error}</p>
                </MensajeEstado>
            )}
            {!cargando && !error && visibles.length === 0 && (
                <MensajeEstado titulo="No hay reservas para mostrar">
                    <p>Probá cambiar el filtro o elegí otro evento.</p>
                </MensajeEstado>
            )}
            {!cargando && !error && visibles.length > 0 && (
                <ReservasTable
                    reservas={visibles}
                    mesas={(mesas ?? []).filter((mesa) => mesa.activa)}
                    accionEnCurso={accionEnCurso}
                    onAccion={solicitarAccion}
                    onAsignarMesa={actualizarMesa}
                />
            )}
            <ConfirmDialog
                abierto={confirmacion !== null}
                titulo={confirmacion?.accion === "cancelar" ? "¿Cancelar reserva?" : "¿Marcar como ausente?"}
                textoConfirmar={confirmacion?.accion === "cancelar" ? "Cancelar reserva" : "Marcar ausente"}
                textoCargando="Guardando…"
                cargando={accionEnCurso !== null}
                onConfirmar={confirmar}
                onCancelar={() => setConfirmacion(null)}
                descripcion={
                    confirmacion?.accion === "cancelar" ? (
                        <p>Vas a cancelar la reserva de <strong>{nombreCliente}</strong>. El lugar se libera y no se puede deshacer.</p>
                    ) : (
                        <p>La reserva de <strong>{nombreCliente}</strong> pasa a "No se presentó", se libera la mesa y suma una ausencia a su historial.</p>
                    )
                }
            >
                {confirmacion?.accion === "cancelar" && (
                    <FormField
                        as="textarea"
                        label="Motivo"
                        name="motivo"
                        value={motivo}
                        onChange={(evento) => {
                            setMotivo(evento.target.value);
                            setErrorMotivo("");
                        }}
                        error={errorMotivo}
                        maxLength={LIMITES_RESERVA.MOTIVO_MAX}
                        placeholder="Ej.: el cliente avisó que no viene"
                        requerido
                    />
                )}
            </ConfirmDialog>
        </>
    );
}
export default function PanelReservasPage() {
    useTituloPagina("Panel de reservas");
    const { datos, cargando, error, recargar } = useRecurso(getEventos);
    const eventos = useMemo(() => ordenarPorFecha(datos ?? []), [datos]);
    const [eventoElegido, setEventoElegido] = useState(null);
    const evento = eventos.find((item) => String(item.id) === eventoElegido) ?? (eventos.length > 0 ? elegirEventoInicial(eventos) : null);
    return (
        <div className="contenedor pagina">
            <EncabezadoPagina
                titulo="Panel de reservas"
                descripcion="Registrá señas, asigná mesas, hacé el check-in y gestioná las reservas de cada evento."
            />
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
            {!cargando && !error && !evento && (
                <MensajeEstado titulo="No hay eventos cargados">
                    <p>Cuando haya eventos en la agenda vas a poder gestionar sus reservas desde acá.</p>
                </MensajeEstado>
            )}
            {!cargando && evento && (
                <>
                    <div className="panel-reservas__selector">
                        <FormField
                            as="select"
                            label="Evento"
                            name="evento"
                            value={String(evento.id)}
                            onChange={(cambio) => setEventoElegido(cambio.target.value)}
                            opciones={eventos.map((item) => ({
                                valor: String(item.id),
                                etiqueta: `${formatearFechaHora(item.fechaHora)} · ${item.titulo}`
                            }))}
                        />
                    </div>
                    <SeccionReservas key={evento.id} evento={evento} />
                </>
            )}
        </div>
    );
}
