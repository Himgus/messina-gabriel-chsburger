import CambioEstado from "../models/CambioEstado.js";
import { EstadoReserva } from "../enums/EstadoReserva.js";
import { minutosDesdeAhora } from "../utils/fechas.js";
const CREADA = "Reserva creada";
const SIN_SENIA = "Confirmada automáticamente: el evento no requiere seña";
const haceDias = (dias) => minutosDesdeAhora(-dias * 24 * 60);
const cambios = [
    new CambioEstado(1, 1, null, EstadoReserva.PENDIENTE, 3, minutosDesdeAhora(-120), CREADA),
    new CambioEstado(2, 2, null, EstadoReserva.PENDIENTE, 4, haceDias(2), CREADA),
    new CambioEstado(3, 2, EstadoReserva.PENDIENTE, EstadoReserva.CONFIRMADA, 2, haceDias(1), "Seña registrada"),
    new CambioEstado(4, 3, null, EstadoReserva.PENDIENTE, 3, haceDias(2), CREADA),
    new CambioEstado(5, 3, EstadoReserva.PENDIENTE, EstadoReserva.CONFIRMADA, null, haceDias(2), SIN_SENIA),
    new CambioEstado(6, 4, null, EstadoReserva.PENDIENTE, 4, haceDias(2), CREADA),
    new CambioEstado(7, 4, EstadoReserva.PENDIENTE, EstadoReserva.CONFIRMADA, null, haceDias(2), SIN_SENIA),
    new CambioEstado(8, 5, null, EstadoReserva.PENDIENTE, 3, haceDias(10), CREADA),
    new CambioEstado(9, 5, EstadoReserva.PENDIENTE, EstadoReserva.CONFIRMADA, null, haceDias(10), SIN_SENIA),
    new CambioEstado(10, 5, EstadoReserva.CONFIRMADA, EstadoReserva.EN_CURSO, 2, haceDias(7), "El cliente llegó (check-in)"),
    new CambioEstado(11, 5, EstadoReserva.EN_CURSO, EstadoReserva.FINALIZADA, 2, haceDias(7), "Terminó el evento"),
    new CambioEstado(12, 6, null, EstadoReserva.PENDIENTE, 4, haceDias(10), CREADA),
    new CambioEstado(13, 6, EstadoReserva.PENDIENTE, EstadoReserva.CONFIRMADA, null, haceDias(10), SIN_SENIA),
    new CambioEstado(14, 6, EstadoReserva.CONFIRMADA, EstadoReserva.NO_SE_PRESENTO, null, haceDias(7), "No se presentó: pasaron 20 minutos del inicio"),
    new CambioEstado(15, 7, null, EstadoReserva.PENDIENTE, 4, haceDias(10), CREADA),
    new CambioEstado(16, 7, EstadoReserva.PENDIENTE, EstadoReserva.CONFIRMADA, null, haceDias(10), SIN_SENIA),
    new CambioEstado(17, 7, EstadoReserva.CONFIRMADA, EstadoReserva.CANCELADA, 4, haceDias(9), "Cancelada por el cliente")
];
let ultimoId = cambios.length;
class CambioEstadoRepository {
    findByReserva(reservaId) {
        return cambios.filter((cambio) => cambio.reservaId === reservaId);
    }
    create(datos) {
        ultimoId++;
        const cambio = new CambioEstado(
            ultimoId,
            datos.reservaId,
            datos.estadoAnterior,
            datos.estadoNuevo,
            datos.usuarioId,
            new Date(),
            datos.motivo
        );
        cambios.push(cambio);
        return cambio;
    }
}
export default new CambioEstadoRepository();
