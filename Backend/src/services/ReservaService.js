import reservaRepository from "../repositories/ReservaRepository.js";
import cambioEstadoRepository from "../repositories/CambioEstadoRepository.js";
import eventoRepository from "../repositories/EventoRepository.js";
import mesaRepository from "../repositories/MesaRepository.js";
import usuarioRepository from "../repositories/UsuarioRepository.js";
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { EstadoReserva } from "../enums/EstadoReserva.js";
import { ReglasNegocio } from "../enums/ReglasNegocio.js";
import { Rol } from "../enums/Rol.js";
import { parseId } from "../utils/parseId.js";
import { diasDesde, horasDesde, horasHasta, minutosDesde } from "../utils/fechas.js";
import { esEnteroEnRango, esObjetoPlano, esTexto, esTextoNoVacio, esValorDeEnum } from "../utils/validators.js";
const TRANSICIONES = Object.freeze({
    [EstadoReserva.PENDIENTE]: [EstadoReserva.CONFIRMADA, EstadoReserva.CANCELADA],
    [EstadoReserva.CONFIRMADA]: [EstadoReserva.EN_CURSO, EstadoReserva.CANCELADA, EstadoReserva.NO_SE_PRESENTO],
    [EstadoReserva.EN_CURSO]: [EstadoReserva.FINALIZADA],
    [EstadoReserva.FINALIZADA]: [],
    [EstadoReserva.CANCELADA]: [],
    [EstadoReserva.NO_SE_PRESENTO]: []
});
const ESTADOS_MODIFICABLES = [EstadoReserva.PENDIENTE, EstadoReserva.CONFIRMADA];
const ESTADOS_CON_MESA = [EstadoReserva.CONFIRMADA, EstadoReserva.EN_CURSO];
const MOTIVO_SENIA_VENCIDA = "Cancelada automáticamente: no se registró la seña a tiempo";
const MOTIVO_AUSENCIA_AUTOMATICA = "No se presentó: pasaron 20 minutos del inicio";
const esPersonalDelLocal = (usuario) => usuario.rol === Rol.EMPLEADO || usuario.rol === Rol.ADMINISTRADOR;
class ReservaService {
    listar(query) {
        const eventoId = query.eventoId !== undefined ? parseId(query.eventoId) : null;
        const estado = esValorDeEnum(query.estado, EstadoReserva) ? query.estado : null;
        return reservaRepository.findAll()
            .filter((reserva) => eventoId === null || reserva.eventoId === eventoId)
            .filter((reserva) => estado === null || reserva.estado === estado)
            .sort((a, b) => a.fechaCreacion - b.fechaCreacion)
            .map((reserva) => this.#enriquecer(reserva));
    }
    listarDeUsuario(usuarioId) {
        return reservaRepository.findByUsuario(usuarioId)
            .map((reserva) => this.#enriquecer(reserva))
            .sort((a, b) => new Date(b.evento?.fechaHora ?? 0) - new Date(a.evento?.fechaHora ?? 0));
    }
    obtener(usuario, id) {
        const reserva = this.#buscar(id);
        if (!esPersonalDelLocal(usuario)) {
            this.#verificarDuenio(usuario, reserva);
        }
        return this.#enriquecer(reserva);
    }
    crear(usuario, body) {
        if (!esObjetoPlano(body)) {
            throw new BadRequestError(Messages.INVALID_DATA);
        }
        if (!Number.isInteger(body.eventoId) || body.eventoId <= 0) {
            throw new BadRequestError(Messages.INVALID_EVENTO_ID);
        }
        this.#validarCantidad(body.cantidadPersonas);
        const observaciones = this.#normalizarObservaciones(body.observaciones);
        const evento = this.#buscarEvento(body.eventoId);
        if (!evento.activo) {
            throw new BadRequestError(Messages.EVENTO_NO_DISPONIBLE);
        }
        if (horasHasta(evento.fechaHora) <= ReglasNegocio.HORAS_CIERRE_RESERVAS) {
            throw new BadRequestError(Messages.RESERVAS_CERRADAS);
        }
        if (reservaRepository.findActivaByUsuarioYEvento(usuario.id, evento.id)) {
            throw new ConflictError(Messages.RESERVA_DUPLICADA);
        }
        const debeSenia = evento.requiereSenia || this.contarAusencias(usuario.id) >= ReglasNegocio.AUSENCIAS_PARA_SENIA;
        if (debeSenia && horasHasta(evento.fechaHora) <= ReglasNegocio.HORAS_LIMITE_CLIENTE) {
            throw new BadRequestError(Messages.SENIA_FUERA_DE_PLAZO);
        }
        this.#verificarLugares(evento, body.cantidadPersonas);
        const reserva = reservaRepository.create({
            usuarioId: usuario.id,
            eventoId: evento.id,
            cantidadPersonas: body.cantidadPersonas,
            estado: EstadoReserva.PENDIENTE,
            observaciones
        });
        this.#registrarCambio(reserva.id, null, EstadoReserva.PENDIENTE, usuario.id, "Reserva creada");
        if (!debeSenia) {
            this.#cambiarEstado(reserva, EstadoReserva.CONFIRMADA, null, "Confirmada automáticamente: el evento no requiere seña");
        }
        return this.#enriquecer(reserva);
    }
    modificar(usuario, id, body) {
        const reserva = this.#buscar(id);
        this.#verificarDuenio(usuario, reserva);
        const evento = this.#buscarEvento(reserva.eventoId);
        this.#verificarModificablePorCliente(reserva, evento);
        if (!esObjetoPlano(body)) {
            throw new BadRequestError(Messages.INVALID_DATA);
        }
        const cantidadPersonas = body.cantidadPersonas ?? reserva.cantidadPersonas;
        this.#validarCantidad(cantidadPersonas);
        const observaciones = body.observaciones !== undefined
            ? this.#normalizarObservaciones(body.observaciones)
            : reserva.observaciones;
        this.#verificarLugares(evento, cantidadPersonas, reserva.cantidadPersonas);
        const mesa = reserva.mesaId ? mesaRepository.findById(reserva.mesaId) : null;
        const mesaId = mesa && mesa.capacidad >= cantidadPersonas ? mesa.id : null;
        const cambios = [];
        if (cantidadPersonas !== reserva.cantidadPersonas) {
            cambios.push(`cantidad de personas de ${reserva.cantidadPersonas} a ${cantidadPersonas}`);
        }
        if (observaciones !== reserva.observaciones) {
            cambios.push(observaciones ? `observaciones: "${observaciones}"` : "se quitaron las observaciones");
        }
        if (mesa && mesaId === null) {
            cambios.push(`se liberó la mesa ${mesa.numero} porque no alcanza para el grupo`);
        }
        reservaRepository.update(reserva.id, { cantidadPersonas, observaciones, mesaId });
        if (cambios.length > 0) {
            this.#registrarModificacion(reserva, usuario.id, `Reserva modificada: ${cambios.join("; ")}`);
        }
        return this.#enriquecer(reserva);
    }
    cancelar(usuario, id, body) {
        const reserva = this.#buscar(id);
        const motivoIngresado = esObjetoPlano(body) && esTextoNoVacio(body.motivo) ? body.motivo.trim() : null;
        if (motivoIngresado && motivoIngresado.length > ReglasNegocio.OBSERVACIONES_MAX) {
            throw new BadRequestError(Messages.INVALID_OBSERVACIONES);
        }
        if (esPersonalDelLocal(usuario)) {
            if (!motivoIngresado) {
                throw new BadRequestError(Messages.INVALID_MOTIVO);
            }
        } else {
            this.#verificarDuenio(usuario, reserva);
            this.#verificarModificablePorCliente(reserva, this.#buscarEvento(reserva.eventoId));
        }
        const motivo = motivoIngresado ?? "Cancelada por el cliente";
        this.#cambiarEstado(reserva, EstadoReserva.CANCELADA, usuario.id, motivo, { motivoCancelacion: motivo });
        return this.#enriquecer(reserva);
    }
    registrarSenia(usuario, id) {
        const reserva = this.#buscar(id);
        this.#cambiarEstado(reserva, EstadoReserva.CONFIRMADA, usuario.id, "Seña registrada", { seniaRegistrada: true });
        return this.#enriquecer(reserva);
    }
    hacerCheckIn(usuario, id) {
        const reserva = this.#buscar(id);
        this.#verificarTransicion(reserva, EstadoReserva.EN_CURSO);
        if (!reserva.mesaId) {
            throw new BadRequestError(Messages.MESA_REQUERIDA);
        }
        this.#cambiarEstado(reserva, EstadoReserva.EN_CURSO, usuario.id, "El cliente llegó (check-in)");
        return this.#enriquecer(reserva);
    }
    finalizar(usuario, id) {
        const reserva = this.#buscar(id);
        this.#cambiarEstado(reserva, EstadoReserva.FINALIZADA, usuario.id, "Terminó el evento");
        return this.#enriquecer(reserva);
    }
    marcarAusente(usuario, id) {
        const reserva = this.#buscar(id);
        this.#verificarTransicion(reserva, EstadoReserva.NO_SE_PRESENTO);
        const evento = this.#buscarEvento(reserva.eventoId);
        if (minutosDesde(evento.fechaHora) < ReglasNegocio.MINUTOS_TOLERANCIA) {
            throw new BadRequestError(Messages.AUSENCIA_ANTICIPADA);
        }
        this.#cambiarEstado(reserva, EstadoReserva.NO_SE_PRESENTO, usuario.id, "El cliente no se presentó");
        return this.#enriquecer(reserva);
    }
    asignarMesa(usuario, id, body) {
        const reserva = this.#buscar(id);
        if (!ESTADOS_CON_MESA.includes(reserva.estado)) {
            throw new BadRequestError(Messages.MESA_NO_ASIGNABLE);
        }
        if (!esObjetoPlano(body)) {
            throw new BadRequestError(Messages.INVALID_DATA);
        }
        const mesa = mesaRepository.findById(parseId(body.mesaId));
        if (!mesa || !mesa.activa) {
            throw new NotFoundError(Messages.MESA_NOT_FOUND);
        }
        if (mesa.capacidad < reserva.cantidadPersonas) {
            throw new BadRequestError(Messages.MESA_CAPACIDAD);
        }
        const ocupada = reservaRepository.findActivasByEvento(reserva.eventoId)
            .some((otra) => otra.id !== reserva.id && otra.mesaId === mesa.id);
        if (ocupada) {
            throw new ConflictError(Messages.MESA_OCUPADA);
        }
        const mesaAnterior = reserva.mesaId ? mesaRepository.findById(reserva.mesaId) : null;
        if (mesaAnterior?.id === mesa.id) {
            return this.#enriquecer(reserva);
        }
        reservaRepository.update(reserva.id, { mesaId: mesa.id });
        this.#registrarModificacion(
            reserva,
            usuario.id,
            mesaAnterior ? `Cambio de mesa: de la mesa ${mesaAnterior.numero} a la mesa ${mesa.numero}` : `Mesa ${mesa.numero} asignada`
        );
        return this.#enriquecer(reserva);
    }
    cancelarPorSuspension(eventoId, usuarioId, motivo) {
        const afectadas = reservaRepository.findActivasByEvento(eventoId)
            .filter((reserva) => ESTADOS_MODIFICABLES.includes(reserva.estado));
        afectadas.forEach((reserva) => {
            this.#cambiarEstado(reserva, EstadoReserva.CANCELADA, usuarioId, motivo, { motivoCancelacion: motivo });
        });
        return afectadas.length;
    }
    procesarVencimientos() {
        const resultado = { seniasVencidas: 0, ausencias: 0 };
        reservaRepository.findActivas().forEach((reserva) => {
            const evento = eventoRepository.findById(reserva.eventoId);
            if (!evento) {
                return;
            }
            const seniaVencida = horasDesde(reserva.fechaCreacion) >= ReglasNegocio.HORAS_PLAZO_SENIA ||
                horasHasta(evento.fechaHora) <= ReglasNegocio.HORAS_LIMITE_CLIENTE;
            if (reserva.estado === EstadoReserva.PENDIENTE && seniaVencida) {
                this.#cambiarEstado(reserva, EstadoReserva.CANCELADA, null, MOTIVO_SENIA_VENCIDA, { motivoCancelacion: MOTIVO_SENIA_VENCIDA });
                resultado.seniasVencidas++;
            } else if (reserva.estado === EstadoReserva.CONFIRMADA && minutosDesde(evento.fechaHora) >= ReglasNegocio.MINUTOS_TOLERANCIA) {
                this.#cambiarEstado(reserva, EstadoReserva.NO_SE_PRESENTO, null, MOTIVO_AUSENCIA_AUTOMATICA);
                resultado.ausencias++;
            }
        });
        return resultado;
    }
    contarAusencias(usuarioId) {
        return reservaRepository.findByUsuario(usuarioId).filter((reserva) => {
            if (reserva.estado !== EstadoReserva.NO_SE_PRESENTO) {
                return false;
            }
            const evento = eventoRepository.findById(reserva.eventoId);
            return diasDesde(evento?.fechaHora ?? reserva.fechaCreacion) <= ReglasNegocio.DIAS_AUSENCIAS;
        }).length;
    }
    #buscar(id) {
        const reserva = reservaRepository.findById(id);
        if (!reserva) {
            throw new NotFoundError(Messages.RESERVA_NOT_FOUND);
        }
        return reserva;
    }
    #buscarEvento(id) {
        const evento = eventoRepository.findById(id);
        if (!evento) {
            throw new NotFoundError(Messages.EVENTO_NOT_FOUND);
        }
        return evento;
    }
    #verificarDuenio(usuario, reserva) {
        if (reserva.usuarioId !== usuario.id) {
            throw new ForbiddenError(Messages.ACCESO_DENEGADO);
        }
    }
    #verificarModificablePorCliente(reserva, evento) {
        if (!ESTADOS_MODIFICABLES.includes(reserva.estado)) {
            throw new BadRequestError(Messages.RESERVA_NO_MODIFICABLE);
        }
        if (horasHasta(evento.fechaHora) <= ReglasNegocio.HORAS_LIMITE_CLIENTE) {
            throw new BadRequestError(Messages.LIMITE_CLIENTE);
        }
    }
    #clientePuedeModificar(reserva, evento) {
        return Boolean(evento) &&
            ESTADOS_MODIFICABLES.includes(reserva.estado) &&
            horasHasta(evento.fechaHora) > ReglasNegocio.HORAS_LIMITE_CLIENTE;
    }
    #validarCantidad(cantidad) {
        if (!esEnteroEnRango(cantidad, ReglasNegocio.MIN_PERSONAS, ReglasNegocio.MAX_PERSONAS)) {
            throw new BadRequestError(Messages.INVALID_CANTIDAD_PERSONAS);
        }
    }
    #normalizarObservaciones(observaciones) {
        if (observaciones === undefined || observaciones === null) {
            return null;
        }
        if (!esTexto(observaciones) || observaciones.trim().length > ReglasNegocio.OBSERVACIONES_MAX) {
            throw new BadRequestError(Messages.INVALID_OBSERVACIONES);
        }
        return observaciones.trim() || null;
    }
    #verificarLugares(evento, cantidad, cantidadActual = 0) {
        const lugares = evento.cupo - reservaRepository.contarPersonasActivas(evento.id) + cantidadActual;
        if (lugares <= 0) {
            throw new BadRequestError(Messages.EVENTO_COMPLETO);
        }
        if (cantidad > lugares) {
            throw new BadRequestError(`Solo ${lugares === 1 ? "queda 1 lugar" : `quedan ${lugares} lugares`} para este evento.`);
        }
    }
    #verificarTransicion(reserva, nuevoEstado) {
        if (!TRANSICIONES[reserva.estado].includes(nuevoEstado)) {
            throw new BadRequestError(Messages.TRANSICION_INVALIDA);
        }
    }
    #cambiarEstado(reserva, nuevoEstado, usuarioId, motivo, datosExtra = {}) {
        this.#verificarTransicion(reserva, nuevoEstado);
        const estadoAnterior = reserva.estado;
        reservaRepository.update(reserva.id, { ...datosExtra, estado: nuevoEstado });
        this.#registrarCambio(reserva.id, estadoAnterior, nuevoEstado, usuarioId, motivo);
    }
    #registrarModificacion(reserva, usuarioId, detalle) {
        this.#registrarCambio(reserva.id, reserva.estado, reserva.estado, usuarioId, detalle);
    }
    #registrarCambio(reservaId, estadoAnterior, estadoNuevo, usuarioId, motivo) {
        cambioEstadoRepository.create({ reservaId, estadoAnterior, estadoNuevo, usuarioId, motivo });
    }
    #nombreResponsable(usuarioId) {
        const usuario = usuarioId ? usuarioRepository.findById(usuarioId) : null;
        return usuario ? `${usuario.nombre} ${usuario.apellido}` : "Sistema";
    }
    #enriquecer(reserva) {
        const evento = eventoRepository.findById(reserva.eventoId);
        const mesa = reserva.mesaId ? mesaRepository.findById(reserva.mesaId) : null;
        const cliente = usuarioRepository.findById(reserva.usuarioId);
        return {
            ...reserva,
            evento: evento && {
                id: evento.id,
                titulo: evento.titulo,
                tipo: evento.tipo,
                competencia: evento.competencia,
                fechaHora: evento.fechaHora,
                requiereSenia: evento.requiereSenia,
                montoSenia: evento.montoSenia
            },
            mesa: mesa && { id: mesa.id, numero: mesa.numero, sector: mesa.sector, capacidad: mesa.capacidad },
            cliente: cliente && {
                id: cliente.id,
                nombre: cliente.nombre,
                apellido: cliente.apellido,
                email: cliente.email,
                telefono: cliente.telefono,
                ausencias: this.contarAusencias(cliente.id)
            },
            historial: cambioEstadoRepository.findByReserva(reserva.id).map((cambio) => ({
                ...cambio,
                responsable: this.#nombreResponsable(cambio.usuarioId)
            })),
            puedeModificarse: this.#clientePuedeModificar(reserva, evento)
        };
    }
}
export default new ReservaService();
