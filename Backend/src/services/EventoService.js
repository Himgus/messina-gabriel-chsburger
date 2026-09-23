import eventoRepository from "../repositories/EventoRepository.js";
import { BadRequestError, NotFoundError, ConflictError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { TipoEvento } from "../enums/TipoEvento.js";
import {
    esTextoNoVacio,
    esTexto,
    esBooleano,
    esEnteroPositivo,
    esNumeroPositivo,
    esFechaValida,
    esValorDeEnum,
    esObjetoPlano
} from "../utils/validators.js";
const VALORES_POR_DEFECTO = Object.freeze({
    competencia: null,
    requiereSenia: false,
    montoSenia: 0,
    destacado: false,
    activo: true
});
class EventoService {
    getAll() {
        return eventoRepository.findAll();
    }
    getById(id) {
        const evento = eventoRepository.findById(id);
        if (!evento) {
            throw new NotFoundError(Messages.EVENTO_NOT_FOUND);
        }
        return evento;
    }
    create(body) {
        const datos = this.#combinar(body, VALORES_POR_DEFECTO);
        this.#validar(datos);
        const evento = this.#normalizar(datos);
        this.#verificarDuplicado(evento);
        return eventoRepository.create(evento);
    }
    update(id, body) {
        const existente = this.getById(id);
        const datos = this.#combinar(body, existente);
        this.#validar(datos);
        const evento = this.#normalizar(datos);
        this.#verificarDuplicado(evento, id);
        return eventoRepository.update(id, evento);
    }
    delete(id) {
        const eliminado = eventoRepository.delete(id);
        if (!eliminado) {
            throw new NotFoundError(Messages.EVENTO_NOT_FOUND);
        }
        return eliminado;
    }
    #combinar(body, base) {
        if (!esObjetoPlano(body)) {
            throw new BadRequestError(Messages.INVALID_DATA);
        }
        return {
            titulo: body.titulo ?? base.titulo,
            tipo: body.tipo ?? base.tipo,
            competencia: body.competencia !== undefined ? body.competencia : base.competencia,
            fechaHora: body.fechaHora ?? base.fechaHora,
            cupo: body.cupo ?? base.cupo,
            requiereSenia: body.requiereSenia ?? base.requiereSenia,
            montoSenia: body.montoSenia ?? base.montoSenia,
            destacado: body.destacado ?? base.destacado,
            activo: body.activo ?? base.activo
        };
    }
    #validar(datos) {
        if (!esTextoNoVacio(datos.titulo)) {
            throw new BadRequestError(Messages.INVALID_TITULO);
        }
        if (!esValorDeEnum(datos.tipo, TipoEvento)) {
            throw new BadRequestError(Messages.INVALID_TIPO);
        }
        if (datos.competencia !== null && !esTexto(datos.competencia)) {
            throw new BadRequestError(Messages.INVALID_COMPETENCIA);
        }
        if (!esFechaValida(datos.fechaHora)) {
            throw new BadRequestError(Messages.INVALID_FECHA_HORA);
        }
        if (!esEnteroPositivo(datos.cupo)) {
            throw new BadRequestError(Messages.INVALID_CUPO);
        }
        if (!esBooleano(datos.requiereSenia)) {
            throw new BadRequestError(Messages.INVALID_REQUIERE_SENIA);
        }
        if (datos.requiereSenia && !esNumeroPositivo(datos.montoSenia)) {
            throw new BadRequestError(Messages.INVALID_MONTO_SENIA);
        }
        if (!esBooleano(datos.destacado)) {
            throw new BadRequestError(Messages.INVALID_DESTACADO);
        }
        if (!esBooleano(datos.activo)) {
            throw new BadRequestError(Messages.INVALID_ACTIVO);
        }
    }
    #normalizar(datos) {
        return {
            ...datos,
            titulo: datos.titulo.trim(),
            fechaHora: new Date(datos.fechaHora),
            montoSenia: datos.requiereSenia ? datos.montoSenia : 0
        };
    }
    #verificarDuplicado(datos, idActual = null) {
        const duplicado = eventoRepository.findByTituloYFecha(datos.titulo, datos.fechaHora);
        if (duplicado && duplicado.id !== idActual) {
            throw new ConflictError(Messages.EVENTO_DUPLICATED);
        }
    }
}
export default new EventoService();
