import eventoRepository from "../repositories/EventoRepository.js";
import reservaRepository from "../repositories/ReservaRepository.js";
import { EstadoReserva } from "../enums/EstadoReserva.js";
const ESTADOS_ASISTENCIA = [
    EstadoReserva.PENDIENTE,
    EstadoReserva.CONFIRMADA,
    EstadoReserva.EN_CURSO,
    EstadoReserva.FINALIZADA
];
class ReporteService {
    ocupacion() {
        return eventoRepository.findAll()
            .map((evento) => {
                const reservas = reservaRepository.findByEvento(evento.id);
                const contarEstado = (estado) => reservas.filter((reserva) => reserva.estado === estado).length;
                const personasReservadas = reservas
                    .filter((reserva) => ESTADOS_ASISTENCIA.includes(reserva.estado))
                    .reduce((total, reserva) => total + reserva.cantidadPersonas, 0);
                return {
                    eventoId: evento.id,
                    titulo: evento.titulo,
                    tipo: evento.tipo,
                    fechaHora: evento.fechaHora,
                    cupo: evento.cupo,
                    reservas: reservas.length,
                    personasReservadas,
                    porcentajeOcupacion: Math.round((personasReservadas / evento.cupo) * 100),
                    cancelaciones: contarEstado(EstadoReserva.CANCELADA),
                    ausencias: contarEstado(EstadoReserva.NO_SE_PRESENTO)
                };
            })
            .sort((a, b) => b.personasReservadas - a.personasReservadas);
    }
}
export default new ReporteService();
