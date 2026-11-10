import Reserva from "../models/Reserva.js";
import { EstadoReserva } from "../enums/EstadoReserva.js";
const ESTADOS_ACTIVOS = [EstadoReserva.PENDIENTE, EstadoReserva.CONFIRMADA, EstadoReserva.EN_CURSO];
const reservas = [
    new Reserva(1, 3, 1, null, 4, EstadoReserva.PENDIENTE, false, "Festejo de cumpleaños", null, new Date("2026-11-08T14:00:00.000Z")),
    new Reserva(2, 4, 1, null, 6, EstadoReserva.CONFIRMADA, true, null, null, new Date("2026-11-07T21:15:00.000Z")),
    new Reserva(3, 3, 4, 1, 2, EstadoReserva.CONFIRMADA, false, null, null, new Date("2026-11-05T10:00:00.000Z")),
    new Reserva(4, 4, 4, null, 5, EstadoReserva.CONFIRMADA, false, "Silla para bebé", null, new Date("2026-11-06T19:40:00.000Z"))
];
let ultimoId = reservas.length;
class ReservaRepository {
    findAll() {
        return reservas;
    }
    findById(id) {
        return reservas.find((reserva) => reserva.id === id) ?? null;
    }
    findByUsuario(usuarioId) {
        return reservas.filter((reserva) => reserva.usuarioId === usuarioId);
    }
    findByEvento(eventoId) {
        return reservas.filter((reserva) => reserva.eventoId === eventoId);
    }
    findActivasByEvento(eventoId) {
        return this.findByEvento(eventoId).filter((reserva) => ESTADOS_ACTIVOS.includes(reserva.estado));
    }
    findActivaByUsuarioYEvento(usuarioId, eventoId) {
        return this.findActivasByEvento(eventoId).find((reserva) => reserva.usuarioId === usuarioId) ?? null;
    }
    contarPersonasActivas(eventoId) {
        return this.findActivasByEvento(eventoId).reduce((total, reserva) => total + reserva.cantidadPersonas, 0);
    }
    create(datos) {
        ultimoId++;
        const reserva = new Reserva(
            ultimoId,
            datos.usuarioId,
            datos.eventoId,
            null,
            datos.cantidadPersonas,
            datos.estado,
            false,
            datos.observaciones,
            null,
            new Date()
        );
        reservas.push(reserva);
        return reserva;
    }
    update(id, datos) {
        const reserva = this.findById(id);
        if (!reserva) {
            return null;
        }
        Object.assign(reserva, datos, { id });
        return reserva;
    }
}
export { ESTADOS_ACTIVOS };
export default new ReservaRepository();
