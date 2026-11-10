const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PATRON_CONTRASENA = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const PATRON_TELEFONO = /^\d{8,15}$/;
const validarEmail = (email) => {
    if (!email.trim()) {
        return "Ingresá tu email.";
    }
    return PATRON_EMAIL.test(email.trim()) ? undefined : "Ingresá un email válido.";
};
export const validarLogin = (valores) => {
    const errores = {};
    const errorEmail = validarEmail(valores.email);
    if (errorEmail) {
        errores.email = errorEmail;
    }
    if (!valores.contrasena) {
        errores.contrasena = "Ingresá tu contraseña.";
    }
    return errores;
};
export const validarRegistro = (valores) => {
    const errores = {};
    if (!valores.nombre.trim()) {
        errores.nombre = "Ingresá tu nombre.";
    }
    if (!valores.apellido.trim()) {
        errores.apellido = "Ingresá tu apellido.";
    }
    const errorEmail = validarEmail(valores.email);
    if (errorEmail) {
        errores.email = errorEmail;
    }
    if (!PATRON_TELEFONO.test(valores.telefono.trim())) {
        errores.telefono = "Ingresá un teléfono válido (solo números, entre 8 y 15 dígitos).";
    }
    if (!PATRON_CONTRASENA.test(valores.contrasena)) {
        errores.contrasena = "La contraseña debe tener al menos 8 caracteres, una letra y un número.";
    }
    if (!valores.confirmacion) {
        errores.confirmacion = "Repetí la contraseña.";
    } else if (valores.confirmacion !== valores.contrasena) {
        errores.confirmacion = "Las contraseñas no coinciden.";
    }
    return errores;
};
