import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import usuarioRepository from "../repositories/UsuarioRepository.js";
import reservaRepository from "../repositories/ReservaRepository.js";
import reservaService from "./ReservaService.js";
import { BadRequestError, ConflictError, NotFoundError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { Rol } from "../enums/Rol.js";
import { ReglasNegocio } from "../enums/ReglasNegocio.js";
import { esBooleano, esEmail, esObjetoPlano, esTextoNoVacio, esValorDeEnum } from "../utils/validators.js";
const PATRON_CONTRASENA = /^(?=.*[A-Za-z])(?=.*\d).+$/;
const PATRON_TELEFONO = /^\d+$/;
const NOMBRE_MAX = 40;
const ROLES_PERSONAL = [Rol.EMPLEADO, Rol.ADMINISTRADOR];
const encriptar = (contrasena) => bcrypt.hashSync(contrasena, 10);
class UsuarioService {
    listar(query) {
        const rol = esValorDeEnum(query.rol, Rol) ? query.rol : null;
        return usuarioRepository.findAll()
            .filter((usuario) => !usuario.fechaBaja)
            .filter((usuario) => rol === null || usuario.rol === rol)
            .map((usuario) => ({
                ...this.sinContrasena(usuario),
                reservas: reservaService.listarDeUsuario(usuario.id).length,
                ausencias: reservaService.contarAusencias(usuario.id)
            }));
    }
    obtenerConHistorial(id) {
        const usuario = this.buscar(id);
        return {
            ...this.sinContrasena(usuario),
            ausencias: reservaService.contarAusencias(usuario.id),
            reservas: reservaService.listarDeUsuario(usuario.id)
        };
    }
    crear(body, rol) {
        if (!esObjetoPlano(body)) {
            throw new BadRequestError(Messages.INVALID_DATA);
        }
        const { nombre, apellido, email, telefono, contrasena } = body;
        if (![nombre, apellido, email, telefono, contrasena].every(esTextoNoVacio)) {
            throw new BadRequestError(Messages.CAMPOS_OBLIGATORIOS);
        }
        const datosPersonales = this.#validarDatosPersonales({ nombre, apellido, telefono });
        if (!esEmail(email)) {
            throw new BadRequestError(Messages.INVALID_EMAIL);
        }
        this.#validarContrasena(contrasena);
        if (usuarioRepository.findByEmail(email.trim())) {
            throw new ConflictError(Messages.EMAIL_DUPLICATED);
        }
        return usuarioRepository.create({
            ...datosPersonales,
            email: email.trim().toLowerCase(),
            contrasena: encriptar(contrasena),
            rol
        });
    }
    crearPersonal(body) {
        if (!esObjetoPlano(body) || !ROLES_PERSONAL.includes(body.rol)) {
            throw new BadRequestError(Messages.INVALID_ROL_PERSONAL);
        }
        return this.sinContrasena(this.crear(body, body.rol));
    }
    cambiarEstado(administrador, id, body) {
        const usuario = this.buscar(id);
        if (usuario.fechaBaja) {
            throw new BadRequestError(Messages.CUENTA_ELIMINADA);
        }
        if (!esObjetoPlano(body) || !esBooleano(body.activo)) {
            throw new BadRequestError(Messages.INVALID_ACTIVO);
        }
        if (usuario.id === administrador.id && !body.activo) {
            throw new BadRequestError(Messages.AUTODESACTIVACION);
        }
        return this.sinContrasena(usuarioRepository.update(usuario.id, { activo: body.activo }));
    }
    actualizarPerfil(usuario, body) {
        if (!esObjetoPlano(body)) {
            throw new BadRequestError(Messages.INVALID_DATA);
        }
        const datos = this.#validarDatosPersonales({
            nombre: body.nombre ?? usuario.nombre,
            apellido: body.apellido ?? usuario.apellido,
            telefono: body.telefono ?? usuario.telefono
        });
        if (body.contrasenaNueva !== undefined && body.contrasenaNueva !== "") {
            if (!esTextoNoVacio(body.contrasenaActual)) {
                throw new BadRequestError(Messages.CONTRASENA_ACTUAL_REQUERIDA);
            }
            if (!bcrypt.compareSync(body.contrasenaActual, usuario.contrasena)) {
                throw new BadRequestError(Messages.CONTRASENA_ACTUAL_INCORRECTA);
            }
            this.#validarContrasena(body.contrasenaNueva);
            datos.contrasena = encriptar(body.contrasenaNueva);
        }
        return this.sinContrasena(usuarioRepository.update(usuario.id, datos));
    }
    eliminarCuenta(usuario, body) {
        if (!esObjetoPlano(body) || !esTextoNoVacio(body.contrasena)) {
            throw new BadRequestError(Messages.CONTRASENA_REQUERIDA_BAJA);
        }
        if (!bcrypt.compareSync(body.contrasena, usuario.contrasena)) {
            throw new BadRequestError(Messages.CONTRASENA_INCORRECTA_BAJA);
        }
        if (reservaRepository.findActivas().some((reserva) => reserva.usuarioId === usuario.id)) {
            throw new ConflictError(Messages.BAJA_CON_RESERVAS);
        }
        const otrosAdministradores = usuarioRepository.findAll()
            .filter((otro) => otro.rol === Rol.ADMINISTRADOR && otro.activo && otro.id !== usuario.id).length;
        if (usuario.rol === Rol.ADMINISTRADOR && otrosAdministradores === 0) {
            throw new ConflictError(Messages.BAJA_ULTIMO_ADMIN);
        }
        usuarioRepository.update(usuario.id, {
            nombre: "Usuario",
            apellido: "eliminado",
            email: `eliminado-${usuario.id}@chsburger.local`,
            telefono: "00000000",
            contrasena: encriptar(randomUUID()),
            activo: false,
            fechaBaja: new Date()
        });
        return { id: usuario.id };
    }
    buscar(id) {
        const usuario = usuarioRepository.findById(id);
        if (!usuario) {
            throw new NotFoundError(Messages.USUARIO_NOT_FOUND);
        }
        return usuario;
    }
    sinContrasena(usuario) {
        const { contrasena, ...datosPublicos } = usuario;
        return datosPublicos;
    }
    #validarDatosPersonales({ nombre, apellido, telefono }) {
        const esNombreValido = (valor) => esTextoNoVacio(valor) && valor.trim().length <= NOMBRE_MAX;
        if (!esNombreValido(nombre) || !esNombreValido(apellido)) {
            throw new BadRequestError(Messages.INVALID_NOMBRE);
        }
        const telefonoLimpio = typeof telefono === "string" ? telefono.trim() : "";
        if (
            !PATRON_TELEFONO.test(telefonoLimpio) ||
            telefonoLimpio.length < ReglasNegocio.TELEFONO_MIN ||
            telefonoLimpio.length > ReglasNegocio.TELEFONO_MAX
        ) {
            throw new BadRequestError(Messages.INVALID_TELEFONO);
        }
        return { nombre: nombre.trim(), apellido: apellido.trim(), telefono: telefonoLimpio };
    }
    #validarContrasena(contrasena) {
        if (typeof contrasena !== "string" || contrasena.length < ReglasNegocio.CONTRASENA_MIN || !PATRON_CONTRASENA.test(contrasena)) {
            throw new BadRequestError(Messages.INVALID_CONTRASENA);
        }
    }
}
export default new UsuarioService();
