/**
 * Mesa del salón que se asigna a una reserva.
 *
 * sector: "PANTALLA_GRANDE" | "BARRA" | "PATIO"
 */
class Mesa {
    constructor(id, numero, sector, capacidad, activa) {
        this.id = id;
        this.numero = numero;
        this.sector = sector;
        this.capacidad = capacidad;         // cantidad máxima de personas
        this.activa = activa;
    }
}

export default Mesa;
