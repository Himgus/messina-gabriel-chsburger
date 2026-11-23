import Button from "./Button.jsx";
import Etiqueta from "./Etiqueta.jsx";
import { urlArchivo } from "../services/api.js";
import { ETIQUETAS_CATEGORIA } from "../utils/constantes.js";
import { formatearMoneda } from "../utils/formatters.js";
import "./ProductosTable.css";
export default function ProductosTable({ productos, accionEnCurso, onCambiarDisponibilidad, onEliminar }) {
    return (
        <div className="tabla-contenedor" role="region" aria-labelledby="tabla-productos-titulo" tabIndex={0}>
            <table className="tabla">
                <caption id="tabla-productos-titulo" className="visualmente-oculto">
                    Productos del menú ({productos.length})
                </caption>
                <thead>
                    <tr>
                        <th scope="col">Producto</th>
                        <th scope="col">Categoría</th>
                        <th scope="col">Precio</th>
                        <th scope="col">Estado</th>
                        <th scope="col"><span className="visualmente-oculto">Acciones</span></th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto) => (
                        <tr key={producto.id}>
                            <th scope="row" className="tabla__evento">
                                <div className="productos-tabla__producto">
                                    <span className="productos-tabla__miniatura">
                                        {producto.imagen && <img src={urlArchivo(producto.imagen)} alt="" loading="lazy" />}
                                    </span>
                                    <span>
                                        <span className="tabla__titulo">{producto.nombre}</span>
                                        {producto.descripcion && <span className="tabla__detalle productos-tabla__descripcion">{producto.descripcion}</span>}
                                    </span>
                                </div>
                            </th>
                            <td>{ETIQUETAS_CATEGORIA[producto.categoria]}</td>
                            <td>{formatearMoneda(producto.precio)}</td>
                            <td>
                                <div className="evento-etiquetas">
                                    <Etiqueta variante={producto.disponible ? "exito" : "acento"}>
                                        {producto.disponible ? "Disponible" : "Agotado"}
                                    </Etiqueta>
                                    {producto.destacado && <Etiqueta variante="principal">Destacado</Etiqueta>}
                                </div>
                            </td>
                            <td>
                                <div className="tabla__acciones">
                                    <Button
                                        variante="secundario"
                                        tamanio="chico"
                                        disabled={accionEnCurso === producto.id}
                                        onClick={() => onCambiarDisponibilidad(producto)}
                                    >
                                        {producto.disponible ? "Marcar agotado" : "Marcar disponible"}
                                        <span className="visualmente-oculto"> {producto.nombre}</span>
                                    </Button>
                                    <Button to={`/admin/menu/${producto.id}/editar`} variante="secundario" tamanio="chico">
                                        Editar<span className="visualmente-oculto"> {producto.nombre}</span>
                                    </Button>
                                    <Button variante="peligro" tamanio="chico" onClick={() => onEliminar(producto)}>
                                        Eliminar<span className="visualmente-oculto"> {producto.nombre}</span>
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
