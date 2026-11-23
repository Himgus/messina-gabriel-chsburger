import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import usuarioRepository from "../repositories/UsuarioRepository.js";
import usuarioService from "./UsuarioService.js";
import { BadRequestError, UnauthorizedError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { Rol } from "../enums/Rol.js";
import { esObjetoPlano, esTextoNoVacio } from "../utils/validators.js";
const JWT_SECRET = process.env.JWT_SECRET ?? "chs-burger-clave-de-desarrollo";
const JWT_DURACION = "8h";
class AuthService {
    registrar(body) {
        const usuario = usuarioService.crear(body, Rol.CLIENTE);
        return this.#crearSesion(usuario);
    }
    iniciarSesion(body) {
        if (!esObjetoPlano(body) || !esTextoNoVacio(body.email) || !esTextoNoVacio(body.contrasena)) {
            throw new BadRequestError(Messages.CAMPOS_OBLIGATORIOS);
        }
        const usuario = usuarioRepository.findByEmail(body.email.trim());
        if (!usuario || !usuario.activo || !bcrypt.compareSync(body.contrasena, usuario.contrasena)) {
            throw new UnauthorizedError(Messages.CREDENCIALES_INVALIDAS);
        }
        return this.#crearSesion(usuario);
    }
    verificarToken(token) {
        let datos;
        try {
            datos = jwt.verify(token, JWT_SECRET);
        } catch {
            throw new UnauthorizedError(Messages.SESION_INVALIDA);
        }
        const usuario = usuarioRepository.findById(datos.id);
        if (!usuario || !usuario.activo) {
            throw new UnauthorizedError(Messages.SESION_INVALIDA);
        }
        return usuario;
    }
    #crearSesion(usuario) {
        const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, JWT_SECRET, { expiresIn: JWT_DURACION });
        return { token, usuario: usuarioService.sinContrasena(usuario) };
    }
}
export default new AuthService();
