import CambioEstado from "../models/CambioEstado.js";
import { EstadoReserva } from "../enums/EstadoReserva.js";
const cambios = [
    new CambioEstado(1, 1, null, EstadoReserva.PENDIENTE, 3, new Date("2026-11-08T14:00:00.000Z"), "Reserva creada"),
    new CambioEstado(2, 2, null, EstadoReserva.PENDIENTE, 4, new Date("2026-11-07T21:15:00.000Z"), "Reserva creada"),
    new CambioEstado(3, 2, EstadoReserva.PENDIENTE, EstadoReserva.CONFIRMADA, 2, new Date("2026-11-08T12:30:00.000Z"), "Seña registrada"),
    new CambioEstado(4, 3, null, EstadoReserva.PENDIENTE, 3, new Date("2026-11-05T10:00:00.000Z"), "Reserva creada"),
    new CambioEstado(5, 3, EstadoReserva.PENDIENTE, EstadoReserva.CONFIRMADA, null, new Date("2026-11-05T10:00:00.000Z"), "Confirmada automáticamente: el evento no requiere seña"),
    new CambioEstado(6, 4, null, EstadoReserva.PENDIENTE, 4, new Date("2026-11-06T19:40:00.000Z"), "Reserva creada"),
    new CambioEstado(7, 4, EstadoReserva.PENDIENTE, EstadoReserva.CONFIRMADA, null, new Date("2026-11-06T19:40:00.000Z"), "Confirmada automáticamente: el evento no requiere seña")
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
