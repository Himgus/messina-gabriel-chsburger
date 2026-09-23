class Evento {
    constructor(id, titulo, tipo, competencia, fechaHora, cupo, requiereSenia, montoSenia, destacado, activo) {
        this.id = id;
        this.titulo = titulo;
        this.tipo = tipo;
        this.competencia = competencia;
        this.fechaHora = fechaHora;
        this.cupo = cupo;
        this.requiereSenia = requiereSenia;
        this.montoSenia = montoSenia;
        this.destacado = destacado;
        this.activo = activo;
    }
}
export default Evento;
