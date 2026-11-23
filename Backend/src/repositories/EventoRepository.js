import Evento from "../models/Evento.js";
import { TipoEvento } from "../enums/TipoEvento.js";
import { minutosDesdeAhora } from "../utils/fechas.js";
const eventos = [
    new Evento(1, "Boca vs. River", TipoEvento.PARTIDO, "Liga Profesional", new Date("2026-12-06T20:00:00.000Z"), 80, true, 5000, true, true),
    new Evento(2, "Argentina vs. Brasil", TipoEvento.PARTIDO, "Eliminatorias", new Date("2026-12-15T23:30:00.000Z"), 100, true, 8000, false, true),
    new Evento(3, "Noche de rock en vivo", TipoEvento.SHOW, null, new Date("2026-12-12T01:00:00.000Z"), 60, false, 0, false, true),
    new Evento(4, "Racing vs. Independiente", TipoEvento.PARTIDO, "Liga Profesional", minutosDesdeAhora(15), 70, false, 0, false, true),
    new Evento(5, "San Lorenzo vs. Huracán", TipoEvento.PARTIDO, "Liga Profesional", minutosDesdeAhora(-7 * 24 * 60), 70, false, 0, false, true)
];
let ultimoId = eventos.length;
class EventoRepository {
    findAll() {
        return eventos;
    }
    findById(id) {
        return eventos.find((evento) => evento.id === id) ?? null;
    }
    findByTituloYFecha(titulo, fechaHora) {
        return eventos.find((evento) =>
            evento.titulo.toLowerCase() === titulo.toLowerCase() &&
            evento.fechaHora.getTime() === fechaHora.getTime()
        ) ?? null;
    }
    create(datos) {
        ultimoId++;
        const evento = new Evento(
            ultimoId,
            datos.titulo,
            datos.tipo,
            datos.competencia,
            datos.fechaHora,
            datos.cupo,
            datos.requiereSenia,
            datos.montoSenia,
            datos.destacado,
            datos.activo
        );
        eventos.push(evento);
        return evento;
    }
    update(id, datos) {
        const evento = this.findById(id);
        if (!evento) {
            return null;
        }
        Object.assign(evento, datos, { id });
        return evento;
    }
    delete(id) {
        const indice = eventos.findIndex((evento) => evento.id === id);
        if (indice === -1) {
            return null;
        }
        const [eliminado] = eventos.splice(indice, 1);
        return eliminado;
    }
}
export default new EventoRepository();
