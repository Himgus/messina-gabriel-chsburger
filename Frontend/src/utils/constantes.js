export const TipoEvento = Object.freeze({
    PARTIDO: "PARTIDO",
    SHOW: "SHOW",
    TURNO: "TURNO"
});
export const ETIQUETAS_TIPO_EVENTO = Object.freeze({
    [TipoEvento.PARTIDO]: "Partido",
    [TipoEvento.SHOW]: "Show",
    [TipoEvento.TURNO]: "Turno común"
});
export const Rol = Object.freeze({
    CLIENTE: "CLIENTE",
    EMPLEADO: "EMPLEADO",
    ADMINISTRADOR: "ADMINISTRADOR"
});
export const ROLES_PERSONAL = Object.freeze([Rol.EMPLEADO, Rol.ADMINISTRADOR]);
export const EstadoReserva = Object.freeze({
    PENDIENTE: "PENDIENTE",
    CONFIRMADA: "CONFIRMADA",
    EN_CURSO: "EN_CURSO",
    FINALIZADA: "FINALIZADA",
    CANCELADA: "CANCELADA",
    NO_SE_PRESENTO: "NO_SE_PRESENTO"
});
export const ESTADOS_ACTIVOS = Object.freeze([EstadoReserva.PENDIENTE, EstadoReserva.CONFIRMADA, EstadoReserva.EN_CURSO]);
export const ETIQUETAS_ESTADO_RESERVA = Object.freeze({
    [EstadoReserva.PENDIENTE]: "Pendiente",
    [EstadoReserva.CONFIRMADA]: "Confirmada",
    [EstadoReserva.EN_CURSO]: "En curso",
    [EstadoReserva.FINALIZADA]: "Finalizada",
    [EstadoReserva.CANCELADA]: "Cancelada",
    [EstadoReserva.NO_SE_PRESENTO]: "No se presentó"
});
export const VARIANTES_ESTADO_RESERVA = Object.freeze({
    [EstadoReserva.PENDIENTE]: "principal",
    [EstadoReserva.CONFIRMADA]: "exito",
    [EstadoReserva.EN_CURSO]: "oscura",
    [EstadoReserva.FINALIZADA]: "neutra",
    [EstadoReserva.CANCELADA]: "acento",
    [EstadoReserva.NO_SE_PRESENTO]: "apagada"
});
export const ETIQUETAS_SECTOR = Object.freeze({
    PANTALLA_GRANDE: "Pantalla grande",
    BARRA: "Barra",
    PATIO: "Patio"
});
export const LIMITES_EVENTO = Object.freeze({
    TITULO_MAX: 80,
    COMPETENCIA_MAX: 60,
    CUPO_MAX: 200
});
export const LIMITES_RESERVA = Object.freeze({
    MIN_PERSONAS: 1,
    MAX_PERSONAS: 10,
    OBSERVACIONES_MAX: 200,
    MOTIVO_MAX: 200
});
