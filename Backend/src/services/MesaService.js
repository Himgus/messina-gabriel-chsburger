import mesaRepository from "../repositories/MesaRepository.js";
class MesaService {
    getAll() {
        return mesaRepository.findAll().filter((mesa) => mesa.activa);
    }
}
export default new MesaService();
