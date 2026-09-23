/**
 * Reserva de un cliente para un evento.
 *
 * estado: "PENDIENTE" | "CONFIRMADA" | "EN_CURSO" | "FINALIZADA" | "CANCELADA" | "NO_SE_PRESENTO"
 */
class Reserva {
    constructor(id, usuarioId, eventoId, mesaId, cantidadPersonas, estado, seniaRegistrada, observaciones, motivoCancelacion, fechaCreacion) {
        this.id = id;
        this.usuarioId = usuarioId;         // cliente que reserva
        this.eventoId = eventoId;           // evento reservado
        this.mesaId = mesaId;               // null hasta que se asigna una mesa
        this.cantidadPersonas = cantidadPersonas;
        this.estado = estado;
        this.seniaRegistrada = seniaRegistrada;
        this.observaciones = observaciones;
        this.motivoCancelacion = motivoCancelacion;
        this.fechaCreacion = fechaCreacion;
    }
}

export default Reserva;
