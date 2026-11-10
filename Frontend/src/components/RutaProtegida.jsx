import { Navigate, Outlet, useLocation } from "react-router-dom";
import Button from "./Button.jsx";
import MensajeEstado from "./MensajeEstado.jsx";
import { useAuth } from "../hooks/useAuth.js";
export default function RutaProtegida({ roles }) {
    const { usuario } = useAuth();
    const location = useLocation();
    if (!usuario) {
        return <Navigate to="/ingresar" replace state={{ desde: location.pathname }} />;
    }
    if (roles && !roles.includes(usuario.rol)) {
        return (
            <div className="contenedor pagina">
                <h1 className="visualmente-oculto">Acceso denegado</h1>
                <MensajeEstado
                    tipo="error"
                    titulo="Acceso denegado"
                    accion={<Button to="/" variante="accion">Volver al inicio</Button>}
                >
                    <p>Tu cuenta no tiene permisos para ver esta sección.</p>
                </MensajeEstado>
            </div>
        );
    }
    return <Outlet />;
}
