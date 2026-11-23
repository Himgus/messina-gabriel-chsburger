import { useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import Loader from "../components/Loader.jsx";
import MensajeEstado from "../components/MensajeEstado.jsx";
import ProductoForm from "../components/ProductoForm.jsx";
import { useRecurso } from "../hooks/useRecurso.js";
import { useToast } from "../hooks/useToast.js";
import { useTituloPagina } from "../hooks/useTituloPagina.js";
import { createProducto, getProductoById, subirImagenProducto, updateProducto } from "../services/productoService.js";
import { nuevaOpcion, productoAFormulario, VALORES_INICIALES_PRODUCTO } from "../utils/validarProducto.js";
const RUTA_LISTADO = "/admin/menu";
export default function ProductoFormPage() {
    const { id } = useParams();
    const esNuevo = id === undefined;
    const titulo = esNuevo ? "Nuevo producto" : "Editar producto";
    useTituloPagina(titulo);
    const navigate = useNavigate();
    const { mostrarExito, mostrarError } = useToast();
    const cargarProducto = useCallback(() => (esNuevo ? Promise.resolve(null) : getProductoById(id)), [esNuevo, id]);
    const { datos: producto, cargando, error, recargar } = useRecurso(cargarProducto);
    const imagenesSubidas = useRef(new Map());
    const obtenerUrlImagen = async (archivo) => {
        if (!imagenesSubidas.current.has(archivo)) {
            const { url } = await subirImagenProducto(archivo);
            imagenesSubidas.current.set(archivo, url);
        }
        return imagenesSubidas.current.get(archivo);
    };
    const guardar = async (datos, archivo) => {
        try {
            const imagen = archivo ? await obtenerUrlImagen(archivo) : datos.imagen;
            if (esNuevo) {
                await createProducto({ ...datos, imagen });
                mostrarExito(`Se agregó "${datos.nombre}" al menú.`);
            } else {
                await updateProducto(id, { ...datos, imagen });
                mostrarExito(`Se guardaron los cambios de "${datos.nombre}".`);
            }
            navigate(RUTA_LISTADO);
        } catch (errorGuardado) {
            mostrarError(errorGuardado.message);
        }
    };
    return (
        <div className="contenedor pagina pagina-formulario">
            <EncabezadoPagina
                titulo={titulo}
                descripcion={esNuevo ? "Agregá una burger, combo, entrada o bebida al menú." : producto?.nombre}
                volverA={RUTA_LISTADO}
                textoVolver="Volver al menú"
            />
            {cargando && <Loader mensaje="Cargando el producto…" />}
            {!cargando && error && (
                <MensajeEstado
                    tipo="error"
                    titulo="No pudimos cargar el producto"
                    accion={<Button variante="secundario" onClick={recargar}>Reintentar</Button>}
                >
                    <p>{error}</p>
                </MensajeEstado>
            )}
            {!cargando && !error && (
                <ProductoForm
                    key={producto?.id ?? "nuevo"}
                    producto={producto}
                    valoresIniciales={producto ? productoAFormulario(producto) : VALORES_INICIALES_PRODUCTO}
                    opcionesIniciales={producto ? producto.opciones.map((opcion) => nuevaOpcion(opcion)) : []}
                    textoBoton={esNuevo ? "Agregar al menú" : "Guardar cambios"}
                    onSubmit={guardar}
                    onCancelar={() => navigate(RUTA_LISTADO)}
                />
            )}
        </div>
    );
}
