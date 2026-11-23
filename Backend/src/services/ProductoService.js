import productoRepository from "../repositories/ProductoRepository.js";
import { BadRequestError, ConflictError, NotFoundError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { CategoriaProducto } from "../enums/CategoriaProducto.js";
import { eliminarImagenSubida, RUTA_IMAGENES_PRODUCTOS } from "../utils/archivos.js";
import { esBooleano, esEnteroEnRango, esObjetoPlano, esTexto, esTextoNoVacio, esValorDeEnum } from "../utils/validators.js";
const NOMBRE_MAX = 60;
const DESCRIPCION_MAX = 300;
const PRECIO_MAX = 1000000;
const OPCIONES_MAX = 8;
const DESTACADOS_MAX = 4;
const ORDEN_CATEGORIAS = Object.values(CategoriaProducto);
const PATRON_IMAGEN = /^\/(imagenes|uploads)\/[\w-]+(\/[\w-]+)*\.(png|jpg|jpeg|webp)$/i;
const VALORES_POR_DEFECTO = Object.freeze({
    descripcion: "",
    imagen: null,
    opciones: [],
    destacado: false,
    disponible: true
});
const esOpcionValida = (opcion) =>
    esObjetoPlano(opcion) &&
    esTextoNoVacio(opcion.nombre) &&
    opcion.nombre.trim().length <= NOMBRE_MAX &&
    esEnteroEnRango(opcion.precio, 1, PRECIO_MAX) &&
    esBooleano(opcion.adicional);
class ProductoService {
    getAll(query) {
        const categoria = esValorDeEnum(query.categoria, CategoriaProducto) ? query.categoria : null;
        const soloDestacados = query.destacado === "true";
        return productoRepository.findAll()
            .filter((producto) => categoria === null || producto.categoria === categoria)
            .filter((producto) => !soloDestacados || producto.destacado)
            .sort((a, b) => ORDEN_CATEGORIAS.indexOf(a.categoria) - ORDEN_CATEGORIAS.indexOf(b.categoria) || a.id - b.id);
    }
    getById(id) {
        const producto = productoRepository.findById(id);
        if (!producto) {
            throw new NotFoundError(Messages.PRODUCTO_NOT_FOUND);
        }
        return producto;
    }
    create(body) {
        const datos = this.#normalizar(this.#combinar(body, VALORES_POR_DEFECTO));
        this.#verificarNombreUnico(datos.nombre);
        this.#verificarDestacados(datos);
        return productoRepository.create(datos);
    }
    update(id, body) {
        const existente = this.getById(id);
        const imagenAnterior = existente.imagen;
        const datos = this.#normalizar(this.#combinar(body, existente));
        this.#verificarNombreUnico(datos.nombre, id);
        this.#verificarDestacados(datos, id);
        const actualizado = productoRepository.update(id, datos);
        if (imagenAnterior !== actualizado.imagen) {
            eliminarImagenSubida(imagenAnterior);
        }
        return actualizado;
    }
    delete(id) {
        this.getById(id);
        const eliminado = productoRepository.delete(id);
        eliminarImagenSubida(eliminado.imagen);
        return eliminado;
    }
    registrarImagen(archivo) {
        if (!archivo) {
            throw new BadRequestError(Messages.IMAGEN_REQUERIDA);
        }
        return { url: `${RUTA_IMAGENES_PRODUCTOS}/${archivo.filename}` };
    }
    #combinar(body, base) {
        if (!esObjetoPlano(body)) {
            throw new BadRequestError(Messages.INVALID_DATA);
        }
        return {
            nombre: body.nombre ?? base.nombre,
            categoria: body.categoria ?? base.categoria,
            descripcion: body.descripcion ?? base.descripcion,
            precio: body.precio ?? base.precio,
            imagen: body.imagen !== undefined ? body.imagen : base.imagen,
            opciones: body.opciones ?? base.opciones,
            destacado: body.destacado ?? base.destacado,
            disponible: body.disponible ?? base.disponible
        };
    }
    #normalizar(datos) {
        if (!esTextoNoVacio(datos.nombre) || datos.nombre.trim().length > NOMBRE_MAX) {
            throw new BadRequestError(Messages.INVALID_NOMBRE_PRODUCTO);
        }
        if (!esValorDeEnum(datos.categoria, CategoriaProducto)) {
            throw new BadRequestError(Messages.INVALID_CATEGORIA);
        }
        if (!esTexto(datos.descripcion) || datos.descripcion.trim().length > DESCRIPCION_MAX) {
            throw new BadRequestError(Messages.INVALID_DESCRIPCION_PRODUCTO);
        }
        if (!esEnteroEnRango(datos.precio, 1, PRECIO_MAX)) {
            throw new BadRequestError(Messages.INVALID_PRECIO);
        }
        if (datos.imagen !== null && (!esTexto(datos.imagen) || !PATRON_IMAGEN.test(datos.imagen))) {
            throw new BadRequestError(Messages.INVALID_IMAGEN);
        }
        if (!Array.isArray(datos.opciones) || datos.opciones.length > OPCIONES_MAX || !datos.opciones.every(esOpcionValida)) {
            throw new BadRequestError(Messages.INVALID_OPCIONES);
        }
        if (!esBooleano(datos.destacado)) {
            throw new BadRequestError(Messages.INVALID_DESTACADO);
        }
        if (!esBooleano(datos.disponible)) {
            throw new BadRequestError(Messages.INVALID_DISPONIBLE);
        }
        return {
            ...datos,
            nombre: datos.nombre.trim(),
            descripcion: datos.descripcion.trim(),
            opciones: datos.opciones.map((opcion) => ({
                nombre: opcion.nombre.trim(),
                precio: opcion.precio,
                adicional: opcion.adicional
            }))
        };
    }
    #verificarNombreUnico(nombre, idActual = null) {
        const existente = productoRepository.findByNombre(nombre);
        if (existente && existente.id !== idActual) {
            throw new ConflictError(Messages.PRODUCTO_DUPLICADO);
        }
    }
    #verificarDestacados(datos, idActual = null) {
        if (!datos.destacado) {
            return;
        }
        const otrosDestacados = productoRepository.findAll()
            .filter((producto) => producto.destacado && producto.id !== idActual).length;
        if (otrosDestacados >= DESTACADOS_MAX) {
            throw new BadRequestError(Messages.MAXIMO_DESTACADOS);
        }
    }
}
export default new ProductoService();
