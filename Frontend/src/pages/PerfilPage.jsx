import { startTransition, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import FormField from "../components/FormField.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useFormulario } from "../hooks/useFormulario.js";
import { useToast } from "../hooks/useToast.js";
import { useTituloPagina } from "../hooks/useTituloPagina.js";
import { deletePerfil } from "../services/authService.js";
import { ETIQUETAS_ROL } from "../utils/constantes.js";
import { validarCambioContrasena, validarPerfil } from "../utils/validarUsuario.js";
import "./PerfilPage.css";
function DatosPersonalesForm({ usuario }) {
    const { actualizarPerfil } = useAuth();
    const { mostrarExito, mostrarError } = useToast();
    const { valores, errores, enviando, formulario, handleChange, handleBlur, handleSubmit } = useFormulario({
        valoresIniciales: { nombre: usuario.nombre, apellido: usuario.apellido, telefono: usuario.telefono },
        validar: validarPerfil,
        onSubmit: async (datos) => {
            try {
                await actualizarPerfil({
                    nombre: datos.nombre.trim(),
                    apellido: datos.apellido.trim(),
                    telefono: datos.telefono.trim()
                });
                mostrarExito("Guardamos tus datos.");
            } catch (error) {
                mostrarError(error.message);
            }
        }
    });
    return (
        <form ref={formulario} className="formulario" onSubmit={handleSubmit} noValidate aria-labelledby="titulo-datos">
            <h2 id="titulo-datos" className="perfil__titulo">Datos personales</h2>
            <FormField label="Email" name="email" value={usuario.email} readOnly ayuda="El email no se puede cambiar." />
            <div className="formulario__fila">
                <FormField label="Nombre" name="nombre" value={valores.nombre} onChange={handleChange} onBlur={handleBlur} error={errores.nombre} requerido />
                <FormField label="Apellido" name="apellido" value={valores.apellido} onChange={handleChange} onBlur={handleBlur} error={errores.apellido} requerido />
            </div>
            <FormField
                type="tel"
                label="Teléfono"
                name="telefono"
                value={valores.telefono}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errores.telefono}
                inputMode="numeric"
                ayuda="Lo usamos para contactarte por tus reservas."
                requerido
            />
            <div className="formulario__acciones">
                <Button type="submit" variante="accion" cargando={enviando}>
                    {enviando ? "Guardando…" : "Guardar datos"}
                </Button>
            </div>
        </form>
    );
}
function ContrasenaForm() {
    const { actualizarPerfil } = useAuth();
    const { mostrarExito, mostrarError } = useToast();
    const { valores, errores, enviando, formulario, handleChange, handleBlur, handleSubmit, reiniciar } = useFormulario({
        valoresIniciales: { contrasenaActual: "", contrasena: "", confirmacion: "" },
        validar: validarCambioContrasena,
        onSubmit: async (datos) => {
            try {
                await actualizarPerfil({ contrasenaActual: datos.contrasenaActual, contrasenaNueva: datos.contrasena });
                reiniciar();
                mostrarExito("Cambiaste tu contraseña.");
            } catch (error) {
                mostrarError(error.message);
            }
        }
    });
    const campo = (nombre) => ({
        type: "password",
        name: nombre,
        value: valores[nombre],
        onChange: handleChange,
        onBlur: handleBlur,
        error: errores[nombre],
        requerido: true
    });
    return (
        <form ref={formulario} className="formulario" onSubmit={handleSubmit} noValidate aria-labelledby="titulo-contrasena">
            <h2 id="titulo-contrasena" className="perfil__titulo">Cambiar contraseña</h2>
            <FormField label="Contraseña actual" autoComplete="current-password" {...campo("contrasenaActual")} />
            <FormField
                label="Contraseña nueva"
                autoComplete="new-password"
                ayuda="Mínimo 8 caracteres, con al menos una letra y un número."
                {...campo("contrasena")}
            />
            <FormField label="Repetir contraseña nueva" autoComplete="new-password" {...campo("confirmacion")} />
            <div className="formulario__acciones">
                <Button type="submit" variante="accion" cargando={enviando}>
                    {enviando ? "Guardando…" : "Cambiar contraseña"}
                </Button>
            </div>
        </form>
    );
}
function EliminarCuenta() {
    const { cerrarSesion } = useAuth();
    const { mostrarExito, mostrarError } = useToast();
    const navigate = useNavigate();
    const [abierto, setAbierto] = useState(false);
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState("");
    const [eliminando, setEliminando] = useState(false);
    const abrir = () => {
        setContrasena("");
        setError("");
        setAbierto(true);
    };
    const confirmar = async () => {
        if (!contrasena) {
            setError("Ingresá tu contraseña para confirmar.");
            return;
        }
        setEliminando(true);
        try {
            await deletePerfil(contrasena);
            setAbierto(false);
            startTransition(() => {
                navigate("/");
                cerrarSesion();
            });
            mostrarExito("Eliminamos tu cuenta. ¡Gracias por haber pasado por CHS Burger!");
        } catch (errorBaja) {
            mostrarError(errorBaja.message);
        } finally {
            setEliminando(false);
        }
    };
    return (
        <section className="formulario perfil__peligro" aria-labelledby="titulo-eliminar">
            <h2 id="titulo-eliminar" className="perfil__titulo">Eliminar cuenta</h2>
            <p className="formulario__aviso">
                Se borran tus datos personales y no vas a poder volver a ingresar. Si tenés reservas activas,
                primero tenés que cancelarlas.
            </p>
            <div>
                <Button variante="peligro" onClick={abrir}>Eliminar mi cuenta</Button>
            </div>
            <ConfirmDialog
                abierto={abierto}
                titulo="¿Eliminar tu cuenta?"
                textoConfirmar="Eliminar cuenta"
                textoCargando="Eliminando…"
                cargando={eliminando}
                onConfirmar={confirmar}
                onCancelar={() => setAbierto(false)}
                descripcion={<p>Esta acción no se puede deshacer. Para confirmar, ingresá tu contraseña.</p>}
            >
                <FormField
                    type="password"
                    label="Contraseña"
                    name="contrasenaBaja"
                    value={contrasena}
                    onChange={(evento) => {
                        setContrasena(evento.target.value);
                        setError("");
                    }}
                    error={error}
                    autoComplete="current-password"
                    requerido
                />
            </ConfirmDialog>
        </section>
    );
}
export default function PerfilPage() {
    useTituloPagina("Mi perfil");
    const { usuario } = useAuth();
    return (
        <div className="contenedor pagina pagina-formulario">
            <EncabezadoPagina titulo="Mi perfil" descripcion={`Cuenta de ${ETIQUETAS_ROL[usuario.rol].toLowerCase()}.`} />
            <div className="perfil__grilla">
                <DatosPersonalesForm usuario={usuario} />
                <ContrasenaForm key={usuario.id} />
                <EliminarCuenta />
            </div>
        </div>
    );
}
