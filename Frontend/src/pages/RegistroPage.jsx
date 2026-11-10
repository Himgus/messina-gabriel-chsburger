import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import FormField from "../components/FormField.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useFormulario } from "../hooks/useFormulario.js";
import { useToast } from "../hooks/useToast.js";
import { useTituloPagina } from "../hooks/useTituloPagina.js";
import { rutaInicial } from "../utils/navegacion.js";
import { validarRegistro } from "../utils/validarUsuario.js";
const VALORES_INICIALES = { nombre: "", apellido: "", email: "", telefono: "", contrasena: "", confirmacion: "" };
export default function RegistroPage() {
    useTituloPagina("Crear cuenta");
    const { usuario, registrar } = useAuth();
    const { mostrarExito, mostrarError } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const desde = location.state?.desde;
    const { valores, errores, enviando, formulario, handleChange, handleBlur, handleSubmit } = useFormulario({
        valoresIniciales: VALORES_INICIALES,
        validar: validarRegistro,
        onSubmit: async (datos) => {
            try {
                const nuevoUsuario = await registrar({
                    nombre: datos.nombre.trim(),
                    apellido: datos.apellido.trim(),
                    email: datos.email.trim(),
                    telefono: datos.telefono.trim(),
                    contrasena: datos.contrasena
                });
                mostrarExito(`¡Listo, ${nuevoUsuario.nombre}! Tu cuenta fue creada.`);
                navigate(desde ?? rutaInicial(nuevoUsuario), { replace: true });
            } catch (error) {
                mostrarError(error.message);
            }
        }
    });
    if (usuario && !enviando) {
        return <Navigate to={desde ?? rutaInicial(usuario)} replace />;
    }
    const campo = (nombre) => ({
        name: nombre,
        value: valores[nombre],
        onChange: handleChange,
        onBlur: handleBlur,
        error: errores[nombre],
        requerido: true
    });
    return (
        <div className="contenedor pagina pagina-angosta">
            <EncabezadoPagina titulo="Crear cuenta" descripcion="Registrate para reservar tu mesa en los partidos y eventos de CHS Burger." />
            <form ref={formulario} className="formulario" onSubmit={handleSubmit} noValidate>
                <p className="formulario__aviso">
                    Todos los campos son obligatorios.
                </p>
                <div className="formulario__fila">
                    <FormField label="Nombre" autoComplete="given-name" {...campo("nombre")} />
                    <FormField label="Apellido" autoComplete="family-name" {...campo("apellido")} />
                </div>
                <FormField type="email" label="Email" autoComplete="email" {...campo("email")} />
                <FormField
                    type="tel"
                    label="Teléfono"
                    autoComplete="tel"
                    inputMode="numeric"
                    ayuda="Solo números, con código de área. Ej.: 1155551234"
                    {...campo("telefono")}
                />
                <FormField
                    type="password"
                    label="Contraseña"
                    autoComplete="new-password"
                    ayuda="Mínimo 8 caracteres, con al menos una letra y un número."
                    {...campo("contrasena")}
                />
                <FormField type="password" label="Repetir contraseña" autoComplete="new-password" {...campo("confirmacion")} />
                <Button type="submit" variante="accion" cargando={enviando}>
                    {enviando ? "Creando cuenta…" : "Crear cuenta"}
                </Button>
                <p className="formulario__pie">
                    ¿Ya tenés cuenta? <Link to="/ingresar" state={{ desde }}>Ingresá</Link>
                </p>
            </form>
        </div>
    );
}
