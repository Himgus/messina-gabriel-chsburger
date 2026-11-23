class Usuario {
    constructor(id, nombre, apellido, email, contrasena, telefono, rol, fechaRegistro, activo, fechaBaja = null) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.contrasena = contrasena;
        this.telefono = telefono;
        this.rol = rol;
        this.fechaRegistro = fechaRegistro;
        this.activo = activo;
        this.fechaBaja = fechaBaja;
    }
}
export default Usuario;
