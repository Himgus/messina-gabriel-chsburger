export const Messages = Object.freeze({
    EVENTO_NOT_FOUND: "El evento no existe.",
    EVENTO_DUPLICATED: "Ya existe un evento con ese título en esa fecha y hora.",
    INVALID_ID: "El ID debe ser un número entero positivo.",
    INVALID_DATA: "Los datos enviados son inválidos.",
    INVALID_JSON: "El cuerpo de la petición no es un JSON válido.",
    INVALID_TITULO: "El título es obligatorio y debe ser un texto.",
    INVALID_TIPO: "El tipo debe ser PARTIDO, SHOW o TURNO.",
    INVALID_COMPETENCIA: "La competencia debe ser un texto.",
    INVALID_FECHA_HORA: "La fecha y hora debe ser una fecha válida.",
    INVALID_CUPO: "El cupo debe ser un número entero positivo.",
    INVALID_REQUIERE_SENIA: "El campo requiereSenia debe ser verdadero o falso.",
    INVALID_MONTO_SENIA: "El monto de la seña debe ser un número mayor a cero cuando se requiere seña.",
    INVALID_DESTACADO: "El campo destacado debe ser verdadero o falso.",
    INVALID_ACTIVO: "El campo activo debe ser verdadero o falso.",
    ROUTE_NOT_FOUND: "La ruta solicitada no existe.",
    INTERNAL_ERROR: "Ocurrió un error inesperado en el servidor."
});
