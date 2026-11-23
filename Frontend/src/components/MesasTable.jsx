import Button from "./Button.jsx";
import Etiqueta from "./Etiqueta.jsx";
import { formatearSector } from "../utils/formatters.js";
export default function MesasTable({ mesas, onEliminar }) {
    return (
        <div className="tabla-contenedor" role="region" aria-labelledby="tabla-mesas-titulo" tabIndex={0}>
            <table className="tabla">
                <caption id="tabla-mesas-titulo" className="visualmente-oculto">
                    Mesas del salón ({mesas.length})
                </caption>
                <thead>
                    <tr>
                        <th scope="col">Mesa</th>
                        <th scope="col">Sector</th>
                        <th scope="col">Capacidad</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Reservas activas</th>
                        <th scope="col"><span className="visualmente-oculto">Acciones</span></th>
                    </tr>
                </thead>
                <tbody>
                    {mesas.map((mesa) => (
                        <tr key={mesa.id}>
                            <th scope="row" className="tabla__titulo">Mesa {mesa.numero}</th>
                            <td>{formatearSector(mesa.sector)}</td>
                            <td>{mesa.capacidad} personas</td>
                            <td>
                                <Etiqueta variante={mesa.activa ? "exito" : "apagada"}>{mesa.activa ? "Activa" : "Inactiva"}</Etiqueta>
                            </td>
                            <td>{mesa.reservasActivas}</td>
                            <td>
                                <div className="tabla__acciones">
                                    <Button to={`/admin/mesas/${mesa.id}/editar`} variante="secundario" tamanio="chico">
                                        Editar<span className="visualmente-oculto"> mesa {mesa.numero}</span>
                                    </Button>
                                    <Button variante="peligro" tamanio="chico" onClick={() => onEliminar(mesa)}>
                                        Eliminar<span className="visualmente-oculto"> mesa {mesa.numero}</span>
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
