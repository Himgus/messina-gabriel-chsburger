import { useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import FormField from "../components/FormField.jsx";
import { useFormulario } from "../hooks/useFormulario.js";
import { useToast } from "../hooks/useToast.js";
import { useTituloPagina } from "../hooks/useTituloPagina.js";
import { createUsuario } from "../services/usuarioService.js";
import { ETIQUETAS_ROL, Rol } from "../utils/constantes.js";
import { validarEmpleado } from "../utils/validarUsuario.js";
const RUTA_LISTADO = "/admin/usuarios";
const VALORES_INICIALES = {
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    rol: Rol.EMPLEADO,
    contrasena: "",
    confirmacion: ""
};
const OPCIONES_ROL = [Rol.EMPLEADO, Rol.ADMINISTRADOR].map((valor) => ({ valor, etiqueta: ETIQUETAS_ROL[valor] }));
export default function UsuarioFormPage() {
    useTituloPagina("Nuevo empleado");
    const navigate = useNavigate();
    const { mostrarExito, mostrarError } = useToast();
    const { valores, errores, enviando, formulario, handleChange, handleBlur, handleSubmit } = useFormulario({
        valoresIniciales: VALORES_INICIALES,
        validar: validarEmpleado,
        onSubmit: async (datos) => {
            try {
                const usuario = await createUsuario({
                    nombre: datos.nombre.trim(),
                    apellido: datos.apellido.trim(),
                    email: datos.email.trim(),
                    telefono: datos.telefono.trim(),
                    contrasena: datos.contrasena,
                    rol: datos.rol
                });
                mostrarExito(`Se creó la cuenta de ${usuario.nombre} ${usuario.apellido}. Ya puede ingresar con su email.`);
                navigate(RUTA_LISTADO);
            } catch (error) {
                mostrarError(error.message);
            }
        }
    });
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
            <EncabezadoPagina
                titulo="Nuevo empleado"
                descripcion="Creá la cuenta para alguien del personal. Va a poder ingresar con este email y contraseña."
                volverA={RUTA_LISTADO}
                textoVolver="Volver a usuarios"
            />
            <form ref={formulario} className="formulario" onSubmit={handleSubmit} noValidate>
                <div className="formulario__fila">
                    <FormField label="Nombre" {...campo("nombre")} />
                    <FormField label="Apellido" {...campo("apellido")} />
                </div>
                <FormField type="email" label="Email" autoComplete="off" {...campo("email")} />
                <FormField type="tel" label="Teléfono" inputMode="numeric" ayuda="Solo números, con código de área." {...campo("telefono")} />
                <FormField
                    as="select"
                    label="Rol"
                    opciones={OPCIONES_ROL}
                    ayuda="Los empleados gestionan las reservas; los administradores, además, todo el sistema."
                    {...campo("rol")}
                />
                <FormField
                    type="password"
                    label="Contraseña inicial"
                    autoComplete="new-password"
                    ayuda="Mínimo 8 caracteres, con al menos una letra y un número."
                    {...campo("contrasena")}
                />
                <FormField type="password" label="Repetir contraseña" autoComplete="new-password" {...campo("confirmacion")} />
                <div className="formulario__acciones">
                    <Button variante="secundario" onClick={() => navigate(RUTA_LISTADO)} disabled={enviando}>Cancelar</Button>
                    <Button type="submit" variante="accion" cargando={enviando}>
                        {enviando ? "Creando…" : "Crear cuenta"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
