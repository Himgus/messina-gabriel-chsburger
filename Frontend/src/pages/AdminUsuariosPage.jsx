import { useCallback, useState } from "react";
import Button from "../components/Button.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import FormField from "../components/FormField.jsx";
import Loader from "../components/Loader.jsx";
import MensajeEstado from "../components/MensajeEstado.jsx";
import UsuariosTable from "../components/UsuariosTable.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useRecurso } from "../hooks/useRecurso.js";
import { useToast } from "../hooks/useToast.js";
import { useTituloPagina } from "../hooks/useTituloPagina.js";
import { cambiarEstadoUsuario, getUsuarios } from "../services/usuarioService.js";
import { ETIQUETAS_ROL } from "../utils/constantes.js";
import "./AdminUsuariosPage.css";
const OPCIONES_ROL = [
    { valor: "", etiqueta: "Todos los roles" },
    ...Object.entries(ETIQUETAS_ROL).map(([valor, etiqueta]) => ({ valor, etiqueta }))
];
export default function AdminUsuariosPage() {
    useTituloPagina("Usuarios");
    const { usuario: usuarioActual } = useAuth();
    const [rol, setRol] = useState("");
    const [usuarioADesactivar, setUsuarioADesactivar] = useState(null);
    const [accionEnCurso, setAccionEnCurso] = useState(null);
    const { mostrarExito, mostrarError } = useToast();
    const cargarUsuarios = useCallback(() => getUsuarios(rol ? { rol } : {}), [rol]);
    const { datos: usuarios, cargando, error, recargar, setDatos } = useRecurso(cargarUsuarios);
    const actualizarEstado = async (usuario, activo) => {
        setAccionEnCurso(usuario.id);
        try {
            const actualizado = await cambiarEstadoUsuario(usuario.id, activo);
            setDatos((actuales) => actuales.map((item) => (item.id === actualizado.id ? { ...item, ...actualizado } : item)));
            mostrarExito(`La cuenta de ${usuario.nombre} ${usuario.apellido} quedó ${activo ? "activa" : "desactivada"}.`);
            setUsuarioADesactivar(null);
        } catch (errorEstado) {
            mostrarError(errorEstado.message);
        } finally {
            setAccionEnCurso(null);
        }
    };
    const solicitarCambio = (usuario) => {
        if (usuario.activo) {
            setUsuarioADesactivar(usuario);
            return;
        }
        actualizarEstado(usuario, true);
    };
    return (
        <div className="contenedor pagina">
            <EncabezadoPagina
                titulo="Usuarios"
                descripcion="Consultá los clientes y su historial, y gestioná las cuentas del personal del local."
            >
                <Button to="/admin/usuarios/nuevo" variante="accion">+ Nuevo empleado</Button>
            </EncabezadoPagina>
            <div className="usuarios__filtro">
                <FormField
                    as="select"
                    label="Mostrar"
                    name="rol"
                    value={rol}
                    onChange={(evento) => setRol(evento.target.value)}
                    opciones={OPCIONES_ROL}
                />
            </div>
            {cargando && <Loader mensaje="Cargando usuarios…" />}
            {!cargando && error && (
                <MensajeEstado
                    tipo="error"
                    titulo="No pudimos cargar los usuarios"
                    accion={<Button variante="secundario" onClick={recargar}>Reintentar</Button>}
                >
                    <p>{error}</p>
                </MensajeEstado>
            )}
            {!cargando && !error && usuarios.length === 0 && (
                <MensajeEstado titulo="No hay usuarios con ese rol" />
            )}
            {!cargando && !error && usuarios.length > 0 && (
                <UsuariosTable
                    usuarios={usuarios}
                    usuarioActualId={usuarioActual.id}
                    accionEnCurso={accionEnCurso}
                    onCambiarEstado={solicitarCambio}
                />
            )}
            <ConfirmDialog
                abierto={usuarioADesactivar !== null}
                titulo="¿Desactivar cuenta?"
                textoConfirmar="Desactivar"
                textoCargando="Desactivando…"
                cargando={accionEnCurso !== null}
                onConfirmar={() => actualizarEstado(usuarioADesactivar, false)}
                onCancelar={() => setUsuarioADesactivar(null)}
                descripcion={
                    <p>
                        <strong>{usuarioADesactivar?.nombre} {usuarioADesactivar?.apellido}</strong> no va a poder iniciar sesión
                        hasta que vuelvas a activar la cuenta.
                    </p>
                }
            />
        </div>
    );
}
