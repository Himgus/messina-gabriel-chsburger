/**
 * Partido, show o turno común para el que se pueden reservar mesas.
 *
 * tipo: "PARTIDO" | "SHOW" | "TURNO"
 */
class Evento {
    constructor(id, titulo, tipo, competencia, fechaHora, cupo, requiereSenia, montoSenia, destacado, activo) {
        this.id = id;
        this.titulo = titulo;               // ej: "Boca vs. River"
        this.tipo = tipo;
        this.competencia = competencia;     // ej: "Liga Profesional"
        this.fechaHora = fechaHora;
        this.cupo = cupo;                   // cantidad máxima de personas
        this.requiereSenia = requiereSenia;
        this.montoSenia = montoSenia;
        this.destacado = destacado;         // se muestra en el hero de la home
        this.activo = activo;               // false si el evento se suspende
    }
}

export default Evento;
