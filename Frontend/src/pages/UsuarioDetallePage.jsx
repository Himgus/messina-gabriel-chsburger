import { useCallback } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import ListaDatos from "../components/ListaDatos.jsx";
import Loader from "../components/Loader.jsx";
import MensajeEstado from "../components/MensajeEstado.jsx";
import ReservaCard from "../components/ReservaCard.jsx";
import { useRecurso } from "../hooks/useRecurso.js";
import { useTituloPagina } from "../hooks/useTituloPagina.js";
import { getUsuarioById } from "../services/usuarioService.js";
import { ETIQUETAS_ROL } from "../utils/constantes.js";
import { formatearFechaCorta } from "../utils/formatters.js";
import "./UsuarioDetallePage.css";
const AUSENCIAS_PARA_SENIA = 3;
export default function UsuarioDetallePage() {
    const { id } = useParams();
    const cargarUsuario = useCallback(() => getUsuarioById(id), [id]);
    const { datos: usuario, cargando, error, recargar } = useRecurso(cargarUsuario);
    useTituloPagina(usuario ? `${usuario.nombre} ${usuario.apellido}` : "Usuario");
    return (
        <div className="contenedor pagina">
            <EncabezadoPagina
                titulo={usuario ? `${usuario.nombre} ${usuario.apellido}` : "Usuario"}
                descripcion={usuario && `${ETIQUETAS_ROL[usuario.rol]}${usuario.activo ? "" : " · cuenta desactivada"}`}
                volverA="/admin/usuarios"
                textoVolver="Volver a usuarios"
            />
            {cargando && <Loader mensaje="Cargando el historial…" />}
            {!cargando && error && (
                <MensajeEstado
                    tipo="error"
                    titulo="No pudimos cargar el usuario"
                    accion={<Button variante="secundario" onClick={recargar}>Reintentar</Button>}
                >
                    <p>{error}</p>
                </MensajeEstado>
            )}
            {!cargando && usuario && (
                <>
                    <ListaDatos
                        variante="destacado"
                        items={[
                            { icono: "ubicacion", etiqueta: "Email", valor: usuario.email },
                            { icono: "whatsapp", etiqueta: "Teléfono", valor: usuario.telefono },
                            { icono: "calendario", etiqueta: "Registrado", valor: formatearFechaCorta(usuario.fechaRegistro) },
                            { icono: "alerta", etiqueta: "Ausencias (90 días)", valor: usuario.ausencias }
                        ]}
                    />
                    {usuario.ausencias >= AUSENCIAS_PARA_SENIA && (
                        <p className="usuario-detalle__aviso" role="note">
                            Este cliente tiene {usuario.ausencias} ausencias en los últimos 90 días: sus nuevas reservas quedan pendientes
                            de seña aunque el evento no la pida.
                        </p>
                    )}
                    <h2 className="usuario-detalle__titulo">Historial de reservas</h2>
                    {usuario.reservas.length === 0 ? (
                        <MensajeEstado titulo="Sin reservas">
                            <p>Este usuario todavía no hizo ninguna reserva.</p>
                        </MensajeEstado>
                    ) : (
                        <ul className="grilla" role="list">
                            {usuario.reservas.map((reserva) => (
                                <li key={reserva.id}>
                                    <ReservaCard reserva={reserva} soloLectura />
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}
