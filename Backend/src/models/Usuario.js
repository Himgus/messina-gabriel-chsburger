/**
 * Usuario del sistema: cliente, empleado o administrador.
 *
 * rol: "CLIENTE" | "EMPLEADO" | "ADMINISTRADOR"
 */
class Usuario {
    constructor(id, nombre, apellido, email, contrasena, telefono, rol, fechaRegistro, activo) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;                 // único en el sistema
        this.contrasena = contrasena;       // se guarda encriptada
        this.telefono = telefono;
        this.rol = rol;
        this.fechaRegistro = fechaRegistro;
        this.activo = activo;
    }
}

export default Usuario;
