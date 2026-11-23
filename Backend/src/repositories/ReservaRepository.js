import Reserva from "../models/Reserva.js";
import { EstadoReserva } from "../enums/EstadoReserva.js";
import { minutosDesdeAhora } from "../utils/fechas.js";
const ESTADOS_ACTIVOS = [EstadoReserva.PENDIENTE, EstadoReserva.CONFIRMADA, EstadoReserva.EN_CURSO];
const HACE_DOS_HORAS = minutosDesdeAhora(-120);
const HACE_DOS_DIAS = minutosDesdeAhora(-2 * 24 * 60);
const HACE_DIEZ_DIAS = minutosDesdeAhora(-10 * 24 * 60);
const reservas = [
    new Reserva(1, 3, 1, null, 4, EstadoReserva.PENDIENTE, false, "Festejo de cumpleaños", null, HACE_DOS_HORAS),
    new Reserva(2, 4, 1, null, 6, EstadoReserva.CONFIRMADA, true, null, null, HACE_DOS_DIAS),
    new Reserva(3, 3, 4, 1, 2, EstadoReserva.CONFIRMADA, false, null, null, HACE_DOS_DIAS),
    new Reserva(4, 4, 4, null, 5, EstadoReserva.CONFIRMADA, false, "Silla para bebé", null, HACE_DOS_DIAS),
    new Reserva(5, 3, 5, 3, 4, EstadoReserva.FINALIZADA, false, null, null, HACE_DIEZ_DIAS),
    new Reserva(6, 4, 5, null, 2, EstadoReserva.NO_SE_PRESENTO, false, null, null, HACE_DIEZ_DIAS),
    new Reserva(7, 4, 3, null, 3, EstadoReserva.CANCELADA, false, null, "Cancelada por el cliente", HACE_DIEZ_DIAS)
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
    findActivas() {
        return reservas.filter((reserva) => ESTADOS_ACTIVOS.includes(reserva.estado));
    }
    findActivasByMesa(mesaId) {
        return this.findActivas().filter((reserva) => reserva.mesaId === mesaId);
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
