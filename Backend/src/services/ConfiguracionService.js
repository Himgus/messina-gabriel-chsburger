import configuracionRepository from "../repositories/ConfiguracionRepository.js";
import eventoRepository from "../repositories/EventoRepository.js";
import { BadRequestError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { esEnteroEnRango, esObjetoPlano, esTextoNoVacio } from "../utils/validators.js";
const CAPACIDAD_MAXIMA = 1000;
const HORARIOS_MAX = 7;
const TEXTO_HORARIO_MAX = 40;
const esTextoCorto = (valor) => esTextoNoVacio(valor) && valor.trim().length <= TEXTO_HORARIO_MAX;
class ConfiguracionService {
    obtener() {
        return configuracionRepository.get();
    }
    actualizar(body) {
        if (!esObjetoPlano(body)) {
            throw new BadRequestError(Messages.INVALID_DATA);
        }
        const actual = configuracionRepository.get();
        const capacidadLocal = body.capacidadLocal ?? actual.capacidadLocal;
        if (!esEnteroEnRango(capacidadLocal, 1, CAPACIDAD_MAXIMA)) {
            throw new BadRequestError(Messages.INVALID_CAPACIDAD_LOCAL);
        }
        const cupoMaximo = Math.max(0, ...eventoRepository.findAll().map((evento) => evento.cupo));
        if (capacidadLocal < cupoMaximo) {
            throw new BadRequestError(`${Messages.CAPACIDAD_MENOR_A_CUPO} (${cupoMaximo} personas).`);
        }
        const horarios = body.horarios ?? actual.horarios;
        const horariosValidos = Array.isArray(horarios) &&
            horarios.length >= 1 &&
            horarios.length <= HORARIOS_MAX &&
            horarios.every((franja) => esObjetoPlano(franja) && esTextoCorto(franja.dias) && esTextoCorto(franja.horario));
        if (!horariosValidos) {
            throw new BadRequestError(Messages.INVALID_HORARIOS);
        }
        return configuracionRepository.update({
            capacidadLocal,
            horarios: horarios.map((franja) => ({ dias: franja.dias.trim(), horario: franja.horario.trim() }))
        });
    }
}
export default new ConfiguracionService();
