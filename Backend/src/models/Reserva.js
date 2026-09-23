class Reserva {
    constructor(id, usuarioId, eventoId, mesaId, cantidadPersonas, estado, seniaRegistrada, observaciones, motivoCancelacion, fechaCreacion) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.eventoId = eventoId;
        this.mesaId = mesaId;
        this.cantidadPersonas = cantidadPersonas;
        this.estado = estado;
        this.seniaRegistrada = seniaRegistrada;
        this.observaciones = observaciones;
        this.motivoCancelacion = motivoCancelacion;
        this.fechaCreacion = fechaCreacion;
    }
}
export default Reserva;
