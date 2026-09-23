/**
 * Registro de cada cambio de estado de una reserva (historial).
 */
class CambioEstado {
    constructor(id, reservaId, estadoAnterior, estadoNuevo, usuarioId, fechaHora, motivo) {
        this.id = id;
        this.reservaId = reservaId;
        this.estadoAnterior = estadoAnterior;
        this.estadoNuevo = estadoNuevo;
        this.usuarioId = usuarioId;         // quién hizo el cambio (null si fue el sistema)
        this.fechaHora = fechaHora;
        this.motivo = motivo;
    }
}

export default CambioEstado;
