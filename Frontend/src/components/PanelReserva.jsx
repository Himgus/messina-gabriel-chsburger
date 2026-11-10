import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button.jsx";
import Loader from "./Loader.jsx";
import ReservaForm from "./ReservaForm.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useRecurso } from "../hooks/useRecurso.js";
import { useToast } from "../hooks/useToast.js";
import { createReserva, getMisReservas } from "../services/reservaService.js";
import { EstadoReserva, ESTADOS_ACTIVOS, LIMITES_RESERVA, Rol } from "../utils/constantes.js";
import { estaCompleto, reservasAbiertas } from "../utils/eventos.js";
import { formatearLugares, formatearMoneda } from "../utils/formatters.js";
import { reservaAFormulario } from "../utils/validarReserva.js";
import "./PanelReserva.css";
function Reglas({ evento }) {
    return (
        <ul className="panel-reserva__reglas">
            <li>Cada reserva es de {LIMITES_RESERVA.MIN_PERSONAS} a {LIMITES_RESERVA.MAX_PERSONAS} personas.</li>
            <li>Las reservas cierran 1 hora antes del inicio.</li>
            <li>Podés modificar o cancelar hasta 2 horas antes.</li>
            {evento.requiereSenia && (
                <li>
                    Requiere una seña de <strong>{formatearMoneda(evento.montoSenia)}</strong> para confirmar el lugar.
                </li>
            )}
        </ul>
    );
}
function FormularioCliente({ evento }) {
    const { datos: misReservas, cargando } = useRecurso(getMisReservas);
    const { mostrarExito, mostrarError } = useToast();
    const navigate = useNavigate();
    const reservaExistente = useMemo(() => (misReservas ?? []).find((reserva) =>
        reserva.eventoId === evento.id && ESTADOS_ACTIVOS.includes(reserva.estado)
    ), [misReservas, evento.id]);
    const reservar = async (datos) => {
        try {
            const reserva = await createReserva({ eventoId: evento.id, ...datos });
            mostrarExito(reserva.estado === EstadoReserva.PENDIENTE
                ? "¡Reserva registrada! Queda pendiente hasta que registremos la seña."
                : "¡Reserva confirmada! Te esperamos.");
            navigate("/mis-reservas");
        } catch (error) {
            mostrarError(error.message);
        }
    };
    if (cargando) {
        return <Loader mensaje="Verificando tus reservas…" />;
    }
    if (reservaExistente) {
        return (
            <>
                <p>Ya tenés una reserva para este evento.</p>
                <Button to="/mis-reservas" variante="accion">Ver mis reservas</Button>
            </>
        );
    }
    return (
        <ReservaForm
            valoresIniciales={reservaAFormulario(null)}
            lugaresDisponibles={evento.lugaresDisponibles}
            textoBoton="Confirmar reserva"
            onSubmit={reservar}
        />
    );
}
function ContenidoPanel({ evento }) {
    const { usuario } = useAuth();
    if (!reservasAbiertas(evento)) {
        return <p>Las reservas para este evento están cerradas.</p>;
    }
    if (estaCompleto(evento)) {
        return <p>El evento está completo. Mirá la agenda para encontrar otro.</p>;
    }
    if (!usuario) {
        return (
            <>
                <p>Ingresá con tu cuenta para reservar. Si todavía no tenés una, registrarte toma un minuto.</p>
                <div className="panel-reserva__botones">
                    <Button to="/ingresar" state={{ desde: `/eventos/${evento.id}` }} variante="accion">
                        Ingresar para reservar
                    </Button>
                    <Button to="/registro" state={{ desde: `/eventos/${evento.id}` }} variante="secundario">
                        Crear cuenta
                    </Button>
                </div>
            </>
        );
    }
    if (usuario.rol !== Rol.CLIENTE) {
        return <p>Las reservas se hacen desde una cuenta de cliente. Gestioná las reservas desde el panel de recepción.</p>;
    }
    return <FormularioCliente evento={evento} />;
}
export default function PanelReserva({ evento }) {
    return (
        <div className="panel-reserva">
            <h2 className="panel-reserva__titulo">Reservá tu mesa</h2>
            <p className="panel-reserva__lugares">{formatearLugares(evento.lugaresDisponibles)} de {evento.cupo}</p>
            <Reglas evento={evento} />
            <ContenidoPanel evento={evento} />
        </div>
    );
}
