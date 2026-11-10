import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import FormField from "../components/FormField.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useFormulario } from "../hooks/useFormulario.js";
import { useToast } from "../hooks/useToast.js";
import { useTituloPagina } from "../hooks/useTituloPagina.js";
import { rutaInicial } from "../utils/navegacion.js";
import { validarLogin } from "../utils/validarUsuario.js";
export default function LoginPage() {
    useTituloPagina("Ingresar");
    const { usuario, iniciarSesion } = useAuth();
    const { mostrarExito, mostrarError } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const desde = location.state?.desde;
    const { valores, errores, enviando, formulario, handleChange, handleBlur, handleSubmit } = useFormulario({
        valoresIniciales: { email: "", contrasena: "" },
        validar: validarLogin,
        onSubmit: async (credenciales) => {
            try {
                const usuarioIngresado = await iniciarSesion(credenciales);
                mostrarExito(`¡Hola, ${usuarioIngresado.nombre}! Ingresaste correctamente.`);
                navigate(desde ?? rutaInicial(usuarioIngresado), { replace: true });
            } catch (error) {
                mostrarError(error.message);
            }
        }
    });
    if (usuario && !enviando) {
        return <Navigate to={desde ?? rutaInicial(usuario)} replace />;
    }
    return (
        <div className="contenedor pagina pagina-angosta">
            <EncabezadoPagina
                titulo="Ingresar"
                descripcion={desde ? "Iniciá sesión para continuar con tu reserva." : "Iniciá sesión para reservar y ver tus reservas."}
            />
            <form ref={formulario} className="formulario" onSubmit={handleSubmit} noValidate>
                <FormField
                    type="email"
                    label="Email"
                    name="email"
                    value={valores.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errores.email}
                    autoComplete="email"
                    requerido
                />
                <FormField
                    type="password"
                    label="Contraseña"
                    name="contrasena"
                    value={valores.contrasena}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errores.contrasena}
                    autoComplete="current-password"
                    requerido
                />
                <Button type="submit" variante="accion" cargando={enviando}>
                    {enviando ? "Ingresando…" : "Ingresar"}
                </Button>
                <p className="formulario__pie">
                    ¿No tenés cuenta? <Link to="/registro" state={{ desde }}>Registrate</Link>
                </p>
            </form>
        </div>
    );
}
