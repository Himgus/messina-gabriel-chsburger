import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import usuarioRepository from "../repositories/UsuarioRepository.js";
import { BadRequestError, ConflictError, UnauthorizedError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { Rol } from "../enums/Rol.js";
import { ReglasNegocio } from "../enums/ReglasNegocio.js";
import { esEmail, esObjetoPlano, esTextoNoVacio } from "../utils/validators.js";
const JWT_SECRET = process.env.JWT_SECRET ?? "chs-burger-clave-de-desarrollo";
const JWT_DURACION = "8h";
const PATRON_CONTRASENA = /^(?=.*[A-Za-z])(?=.*\d).+$/;
const PATRON_TELEFONO = /^\d+$/;
class AuthService {
    registrar(body) {
        if (!esObjetoPlano(body)) {
            throw new BadRequestError(Messages.INVALID_DATA);
        }
        const { nombre, apellido, email, telefono, contrasena } = body;
        if (![nombre, apellido, email, telefono, contrasena].every(esTextoNoVacio)) {
            throw new BadRequestError(Messages.CAMPOS_OBLIGATORIOS);
        }
        if (!esEmail(email)) {
            throw new BadRequestError(Messages.INVALID_EMAIL);
        }
        const telefonoLimpio = telefono.trim();
        if (
            !PATRON_TELEFONO.test(telefonoLimpio) ||
            telefonoLimpio.length < ReglasNegocio.TELEFONO_MIN ||
            telefonoLimpio.length > ReglasNegocio.TELEFONO_MAX
        ) {
            throw new BadRequestError(Messages.INVALID_TELEFONO);
        }
        if (contrasena.length < ReglasNegocio.CONTRASENA_MIN || !PATRON_CONTRASENA.test(contrasena)) {
            throw new BadRequestError(Messages.INVALID_CONTRASENA);
        }
        if (usuarioRepository.findByEmail(email.trim())) {
            throw new ConflictError(Messages.EMAIL_DUPLICATED);
        }
        const usuario = usuarioRepository.create({
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            email: email.trim().toLowerCase(),
            telefono: telefonoLimpio,
            contrasena: bcrypt.hashSync(contrasena, 10),
            rol: Rol.CLIENTE
        });
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
    sinContrasena(usuario) {
        const { contrasena, ...datosPublicos } = usuario;
        return datosPublicos;
    }
    #crearSesion(usuario) {
        const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, JWT_SECRET, { expiresIn: JWT_DURACION });
        return { token, usuario: this.sinContrasena(usuario) };
    }
}
export default new AuthService();
