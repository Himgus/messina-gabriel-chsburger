import Mesa from "../models/Mesa.js";
import { Sector } from "../enums/Sector.js";
const mesas = [
    new Mesa(1, 1, Sector.PANTALLA_GRANDE, 4, true),
    new Mesa(2, 2, Sector.PANTALLA_GRANDE, 4, true),
    new Mesa(3, 3, Sector.PANTALLA_GRANDE, 6, true),
    new Mesa(4, 4, Sector.PANTALLA_GRANDE, 8, true),
    new Mesa(5, 5, Sector.BARRA, 2, true),
    new Mesa(6, 6, Sector.BARRA, 2, true),
    new Mesa(7, 7, Sector.BARRA, 3, true),
    new Mesa(8, 8, Sector.PATIO, 4, true),
    new Mesa(9, 9, Sector.PATIO, 6, true),
    new Mesa(10, 10, Sector.PATIO, 10, true)
];
let ultimoId = mesas.length;
class MesaRepository {
    findAll() {
        return mesas;
    }
    findById(id) {
        return mesas.find((mesa) => mesa.id === id) ?? null;
    }
    findByNumero(numero) {
        return mesas.find((mesa) => mesa.numero === numero) ?? null;
    }
    create(datos) {
        ultimoId++;
        const mesa = new Mesa(ultimoId, datos.numero, datos.sector, datos.capacidad, datos.activa);
        mesas.push(mesa);
        return mesa;
    }
    update(id, datos) {
        const mesa = this.findById(id);
        if (!mesa) {
            return null;
        }
        Object.assign(mesa, datos, { id });
        return mesa;
    }
    delete(id) {
        const indice = mesas.findIndex((mesa) => mesa.id === id);
        if (indice === -1) {
            return null;
        }
        const [eliminada] = mesas.splice(indice, 1);
        return eliminada;
    }
}
export default new MesaRepository();
