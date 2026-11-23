import mesaRepository from "../repositories/MesaRepository.js";
import reservaRepository from "../repositories/ReservaRepository.js";
import { BadRequestError, ConflictError, NotFoundError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { Sector } from "../enums/Sector.js";
import { esBooleano, esEnteroEnRango, esObjetoPlano, esValorDeEnum } from "../utils/validators.js";
const NUMERO_MAX = 999;
const CAPACIDAD_MAX = 20;
class MesaService {
    getAll() {
        return mesaRepository.findAll()
            .map((mesa) => this.#conUso(mesa))
            .sort((a, b) => a.numero - b.numero);
    }
    getById(id) {
        return this.#conUso(this.#buscar(id));
    }
    create(body) {
        const datos = this.#combinar(body, { activa: true });
        this.#validar(datos);
        this.#verificarNumeroUnico(datos.numero);
        return this.#conUso(mesaRepository.create(datos));
    }
    update(id, body) {
        const existente = this.#buscar(id);
        const datos = this.#combinar(body, existente);
        this.#validar(datos);
        this.#verificarNumeroUnico(datos.numero, id);
        const asignadas = reservaRepository.findActivasByMesa(id);
        if (!datos.activa && asignadas.length > 0) {
            throw new ConflictError(Messages.MESA_EN_USO);
        }
        if (asignadas.some((reserva) => reserva.cantidadPersonas > datos.capacidad)) {
            throw new BadRequestError(Messages.MESA_CAPACIDAD_EN_USO);
        }
        return this.#conUso(mesaRepository.update(id, datos));
    }
    delete(id) {
        this.#buscar(id);
        if (reservaRepository.findActivasByMesa(id).length > 0) {
            throw new ConflictError(Messages.MESA_EN_USO);
        }
        return mesaRepository.delete(id);
    }
    #buscar(id) {
        const mesa = mesaRepository.findById(id);
        if (!mesa) {
            throw new NotFoundError(Messages.MESA_NOT_FOUND);
        }
        return mesa;
    }
    #conUso(mesa) {
        return { ...mesa, reservasActivas: reservaRepository.findActivasByMesa(mesa.id).length };
    }
    #combinar(body, base) {
        if (!esObjetoPlano(body)) {
            throw new BadRequestError(Messages.INVALID_DATA);
        }
        return {
            numero: body.numero ?? base.numero,
            sector: body.sector ?? base.sector,
            capacidad: body.capacidad ?? base.capacidad,
            activa: body.activa ?? base.activa
        };
    }
    #validar(datos) {
        if (!esEnteroEnRango(datos.numero, 1, NUMERO_MAX)) {
            throw new BadRequestError(Messages.INVALID_NUMERO_MESA);
        }
        if (!esValorDeEnum(datos.sector, Sector)) {
            throw new BadRequestError(Messages.INVALID_SECTOR);
        }
        if (!esEnteroEnRango(datos.capacidad, 1, CAPACIDAD_MAX)) {
            throw new BadRequestError(Messages.INVALID_CAPACIDAD_MESA);
        }
        if (!esBooleano(datos.activa)) {
            throw new BadRequestError(Messages.INVALID_ACTIVA);
        }
    }
    #verificarNumeroUnico(numero, idActual = null) {
        const existente = mesaRepository.findByNumero(numero);
        if (existente && existente.id !== idActual) {
            throw new ConflictError(Messages.MESA_DUPLICADA);
        }
    }
}
export default new MesaService();
