class CambioEstado {
    constructor(id, reservaId, estadoAnterior, estadoNuevo, usuarioId, fechaHora, motivo) {
        this.id = id;
        this.reservaId = reservaId;
        this.estadoAnterior = estadoAnterior;
        this.estadoNuevo = estadoNuevo;
        this.usuarioId = usuarioId;
        this.fechaHora = fechaHora;
        this.motivo = motivo;
    }
}
export default CambioEstado;
