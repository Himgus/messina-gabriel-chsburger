import bcrypt from "bcryptjs";
import Usuario from "../models/Usuario.js";
import { Rol } from "../enums/Rol.js";
const encriptar = (contrasena) => bcrypt.hashSync(contrasena, 10);
const usuarios = [
    new Usuario(1, "Admin", "CHS", "admin@chsburger.com", encriptar("Admin1234"), "1124056221", Rol.ADMINISTRADOR, new Date("2026-09-01T12:00:00.000Z"), true),
    new Usuario(2, "Lucía", "Gómez", "empleado@chsburger.com", encriptar("Empleado1234"), "1161541576", Rol.EMPLEADO, new Date("2026-09-01T12:00:00.000Z"), true),
    new Usuario(3, "Juan", "Pérez", "cliente@chsburger.com", encriptar("Cliente1234"), "1155551234", Rol.CLIENTE, new Date("2026-10-10T15:00:00.000Z"), true),
    new Usuario(4, "Sofía", "Romero", "sofia@mail.com", encriptar("Cliente1234"), "1144449876", Rol.CLIENTE, new Date("2026-10-20T18:30:00.000Z"), true)
];
let ultimoId = usuarios.length;
class UsuarioRepository {
    findAll() {
        return usuarios;
    }
    findById(id) {
        return usuarios.find((usuario) => usuario.id === id) ?? null;
    }
    findByEmail(email) {
        return usuarios.find((usuario) => usuario.email.toLowerCase() === email.toLowerCase()) ?? null;
    }
    create(datos) {
        ultimoId++;
        const usuario = new Usuario(
            ultimoId,
            datos.nombre,
            datos.apellido,
            datos.email,
            datos.contrasena,
            datos.telefono,
            datos.rol,
            new Date(),
            true
        );
        usuarios.push(usuario);
        return usuario;
    }
}
export default new UsuarioRepository();
