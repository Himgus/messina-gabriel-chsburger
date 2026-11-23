import { useMemo, useState } from "react";
import Button from "../components/Button.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import FormField from "../components/FormField.jsx";
import Loader from "../components/Loader.jsx";
import MensajeEstado from "../components/MensajeEstado.jsx";
import ProductosTable from "../components/ProductosTable.jsx";
import { useRecurso } from "../hooks/useRecurso.js";
import { useToast } from "../hooks/useToast.js";
import { useTituloPagina } from "../hooks/useTituloPagina.js";
import { deleteProducto, getProductos, updateProducto } from "../services/productoService.js";
import { CATEGORIAS_MENU } from "../utils/constantes.js";
import "./AdminMenuPage.css";
const OPCIONES_FILTRO = [
    { valor: "", etiqueta: "Todas las categorías" },
    ...CATEGORIAS_MENU.map(({ valor, etiqueta }) => ({ valor, etiqueta }))
];
export default function AdminMenuPage() {
    useTituloPagina("Menú");
    const { datos, cargando, error, recargar, setDatos } = useRecurso(getProductos);
    const [categoria, setCategoria] = useState("");
    const [productoAEliminar, setProductoAEliminar] = useState(null);
    const [eliminando, setEliminando] = useState(false);
    const [accionEnCurso, setAccionEnCurso] = useState(null);
    const { mostrarExito, mostrarError } = useToast();
    const productos = useMemo(
        () => (datos ?? []).filter((producto) => !categoria || producto.categoria === categoria),
        [datos, categoria]
    );
    const cambiarDisponibilidad = async (producto) => {
        setAccionEnCurso(producto.id);
        try {
            const actualizado = await updateProducto(producto.id, { disponible: !producto.disponible });
            setDatos((actuales) => actuales.map((item) => (item.id === actualizado.id ? actualizado : item)));
            mostrarExito(`"${actualizado.nombre}" quedó ${actualizado.disponible ? "disponible" : "agotado"}.`);
        } catch (errorCambio) {
            mostrarError(errorCambio.message);
        } finally {
            setAccionEnCurso(null);
        }
    };
    const confirmarEliminacion = async () => {
        setEliminando(true);
        try {
            await deleteProducto(productoAEliminar.id);
            setDatos((actuales) => actuales.filter((producto) => producto.id !== productoAEliminar.id));
            mostrarExito(`Se quitó "${productoAEliminar.nombre}" del menú.`);
            setProductoAEliminar(null);
        } catch (errorEliminacion) {
            mostrarError(errorEliminacion.message);
        } finally {
            setEliminando(false);
        }
    };
    return (
        <div className="contenedor pagina">
            <EncabezadoPagina
                titulo="Menú"
                descripcion="Agregá, editá o quitá productos del menú. Lo que cargues acá se ve en la página Menú y en los productos estrella."
            >
                <Button to="/admin/menu/nuevo" variante="accion">+ Nuevo producto</Button>
            </EncabezadoPagina>
            <div className="admin-menu__filtro">
                <FormField
                    as="select"
                    label="Mostrar"
                    name="categoria"
                    value={categoria}
                    onChange={(evento) => setCategoria(evento.target.value)}
                    opciones={OPCIONES_FILTRO}
                />
            </div>
            {cargando && <Loader mensaje="Cargando el menú…" />}
            {!cargando && error && (
                <MensajeEstado
                    tipo="error"
                    titulo="No pudimos cargar el menú"
                    accion={<Button variante="secundario" onClick={recargar}>Reintentar</Button>}
                >
                    <p>{error}</p>
                </MensajeEstado>
            )}
            {!cargando && !error && productos.length === 0 && (
                <MensajeEstado
                    titulo="No hay productos en esta categoría"
                    accion={<Button to="/admin/menu/nuevo" variante="accion">Agregar producto</Button>}
                />
            )}
            {!cargando && !error && productos.length > 0 && (
                <ProductosTable
                    productos={productos}
                    accionEnCurso={accionEnCurso}
                    onCambiarDisponibilidad={cambiarDisponibilidad}
                    onEliminar={setProductoAEliminar}
                />
            )}
            <ConfirmDialog
                abierto={productoAEliminar !== null}
                titulo="¿Quitar del menú?"
                cargando={eliminando}
                onConfirmar={confirmarEliminacion}
                onCancelar={() => setProductoAEliminar(null)}
                descripcion={
                    <p>
                        Vas a eliminar <strong>{productoAEliminar?.nombre}</strong> del menú. Si solo está agotado por hoy,
                        usá "Marcar agotado".
                    </p>
                }
            />
        </div>
    );
}
