import { Rol } from "./constantes.js";
const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PATRON_CONTRASENA = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const PATRON_TELEFONO = /^\d{8,15}$/;
const NOMBRE_MAX = 40;
const validarEmail = (email) => {
    if (!email.trim()) {
        return "Ingresá tu email.";
    }
    return PATRON_EMAIL.test(email.trim()) ? undefined : "Ingresá un email válido.";
};
const validarNombre = (valor, campo) => {
    if (!valor.trim()) {
        return `Ingresá ${campo}.`;
    }
    return valor.trim().length > NOMBRE_MAX ? `Máximo ${NOMBRE_MAX} caracteres.` : undefined;
};
const validarDatosPersonales = (valores) => {
    const errores = {
        nombre: validarNombre(valores.nombre, "el nombre"),
        apellido: validarNombre(valores.apellido, "el apellido")
    };
    if (!PATRON_TELEFONO.test(valores.telefono.trim())) {
        errores.telefono = "Ingresá un teléfono válido (solo números, entre 8 y 15 dígitos).";
    }
    return errores;
};
const validarContrasenaNueva = (contrasena, confirmacion) => {
    const errores = {};
    if (!PATRON_CONTRASENA.test(contrasena)) {
        errores.contrasena = "La contraseña debe tener al menos 8 caracteres, una letra y un número.";
    }
    if (!confirmacion) {
        errores.confirmacion = "Repetí la contraseña.";
    } else if (confirmacion !== contrasena) {
        errores.confirmacion = "Las contraseñas no coinciden.";
    }
    return errores;
};
const sinVacios = (errores) => Object.fromEntries(Object.entries(errores).filter(([, mensaje]) => mensaje));
export const validarLogin = (valores) => sinVacios({
    email: validarEmail(valores.email),
    contrasena: valores.contrasena ? undefined : "Ingresá tu contraseña."
});
export const validarRegistro = (valores) => sinVacios({
    ...validarDatosPersonales(valores),
    email: validarEmail(valores.email),
    ...validarContrasenaNueva(valores.contrasena, valores.confirmacion)
});
export const validarEmpleado = (valores) => sinVacios({
    ...validarRegistro(valores),
    rol: [Rol.EMPLEADO, Rol.ADMINISTRADOR].includes(valores.rol) ? undefined : "Elegí el rol."
});
export const validarPerfil = (valores) => sinVacios(validarDatosPersonales(valores));
export const validarCambioContrasena = (valores) => sinVacios({
    contrasenaActual: valores.contrasenaActual ? undefined : "Ingresá tu contraseña actual.",
    ...validarContrasenaNueva(valores.contrasena, valores.confirmacion)
});
