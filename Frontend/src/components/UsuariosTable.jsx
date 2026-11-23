import { Link } from "react-router-dom";
import Button from "./Button.jsx";
import Etiqueta from "./Etiqueta.jsx";
import { ETIQUETAS_ROL, Rol } from "../utils/constantes.js";
export default function UsuariosTable({ usuarios, usuarioActualId, accionEnCurso, onCambiarEstado }) {
    return (
        <div className="tabla-contenedor" role="region" aria-labelledby="tabla-usuarios-titulo" tabIndex={0}>
            <table className="tabla">
                <caption id="tabla-usuarios-titulo" className="visualmente-oculto">
                    Usuarios del sistema ({usuarios.length})
                </caption>
                <thead>
                    <tr>
                        <th scope="col">Usuario</th>
                        <th scope="col">Rol</th>
                        <th scope="col">Reservas</th>
                        <th scope="col">Ausencias (90 días)</th>
                        <th scope="col">Estado</th>
                        <th scope="col"><span className="visualmente-oculto">Acciones</span></th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => {
                        const nombre = `${usuario.nombre} ${usuario.apellido}`;
                        return (
                            <tr key={usuario.id}>
                                <th scope="row" className="tabla__evento">
                                    <Link to={`/admin/usuarios/${usuario.id}`} className="tabla__titulo">{nombre}</Link>
                                    <span className="tabla__detalle">{usuario.email} · {usuario.telefono}</span>
                                </th>
                                <td>
                                    <Etiqueta variante={usuario.rol === Rol.CLIENTE ? "neutra" : "oscura"}>{ETIQUETAS_ROL[usuario.rol]}</Etiqueta>
                                </td>
                                <td>{usuario.reservas}</td>
                                <td>{usuario.ausencias}</td>
                                <td>
                                    <Etiqueta variante={usuario.activo ? "exito" : "apagada"}>{usuario.activo ? "Activo" : "Inactivo"}</Etiqueta>
                                </td>
                                <td>
                                    <div className="tabla__acciones">
                                        <Button to={`/admin/usuarios/${usuario.id}`} variante="secundario" tamanio="chico">
                                            Ver historial<span className="visualmente-oculto"> de {nombre}</span>
                                        </Button>
                                        {usuario.id !== usuarioActualId && (
                                            <Button
                                                variante={usuario.activo ? "peligro" : "principal"}
                                                tamanio="chico"
                                                disabled={accionEnCurso === usuario.id}
                                                onClick={() => onCambiarEstado(usuario)}
                                            >
                                                {usuario.activo ? "Desactivar" : "Activar"}
                                                <span className="visualmente-oculto"> la cuenta de {nombre}</span>
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
