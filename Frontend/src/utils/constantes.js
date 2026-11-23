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
    COMPETENCIA_MAX: 60
});
export const LIMITES_RESERVA = Object.freeze({
    MIN_PERSONAS: 1,
    MAX_PERSONAS: 10,
    OBSERVACIONES_MAX: 200,
    MOTIVO_MAX: 200
});
export const ETIQUETAS_ROL = Object.freeze({
    [Rol.CLIENTE]: "Cliente",
    [Rol.EMPLEADO]: "Empleado",
    [Rol.ADMINISTRADOR]: "Administrador"
});
export const LIMITES_MESA = Object.freeze({
    NUMERO_MAX: 999,
    CAPACIDAD_MAX: 20
});
export const LIMITES_CONFIGURACION = Object.freeze({
    CAPACIDAD_MAX: 1000,
    HORARIOS_MAX: 7,
    TEXTO_HORARIO_MAX: 40
});
export const EVENTO_CONFIGURACION_ACTUALIZADA = "chs-burger:configuracion-actualizada";
export const CategoriaProducto = Object.freeze({
    BURGER: "BURGER",
    LINEA_DOBLE: "LINEA_DOBLE",
    COMBO: "COMBO",
    BALDAZO: "BALDAZO",
    ENTRADA: "ENTRADA",
    BEBIDA: "BEBIDA"
});
export const CATEGORIAS_MENU = Object.freeze([
    {
        valor: CategoriaProducto.BURGER,
        etiqueta: "Burgers",
        ancla: "burgers",
        descripcion: "Panes de 12 cm y carnes de 130 g. Todas vienen con salsa CHS y papas chicas de 80 g."
    },
    {
        valor: CategoriaProducto.LINEA_DOBLE,
        etiqueta: "Línea doble",
        ancla: "linea-doble",
        descripcion: "¡Aún más poderosas!"
    },
    {
        valor: CategoriaProducto.COMBO,
        etiqueta: "Combos",
        ancla: "combos",
        descripcion: "Para resolver de una: burger, papas y bebida."
    },
    {
        valor: CategoriaProducto.BALDAZO,
        etiqueta: "Baldazos y especiales",
        ancla: "baldazos",
        descripcion: "Los que nos hicieron famosos. Ideales para compartir."
    },
    {
        valor: CategoriaProducto.ENTRADA,
        etiqueta: "Entradas",
        ancla: "entradas",
        descripcion: "Para picar mientras empieza el partido."
    },
    {
        valor: CategoriaProducto.BEBIDA,
        etiqueta: "Bebidas",
        ancla: "bebidas",
        descripcion: ""
    }
]);
export const ETIQUETAS_CATEGORIA = Object.freeze(
    Object.fromEntries(CATEGORIAS_MENU.map((categoria) => [categoria.valor, categoria.etiqueta]))
);
export const LIMITES_PRODUCTO = Object.freeze({
    NOMBRE_MAX: 60,
    DESCRIPCION_MAX: 300,
    PRECIO_MAX: 1000000,
    OPCIONES_MAX: 8,
    DESTACADOS_MAX: 4,
    IMAGEN_MAX_MB: 3
});
export const TIPOS_IMAGEN = Object.freeze(["image/png", "image/jpeg", "image/webp"]);
