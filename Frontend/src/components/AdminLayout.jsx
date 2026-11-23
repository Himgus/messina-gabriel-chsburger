import { NavLink, Outlet } from "react-router-dom";
import "./AdminLayout.css";
const SECCIONES = [
    { texto: "Eventos", destino: "/admin/eventos" },
    { texto: "Menú", destino: "/admin/menu" },
    { texto: "Mesas", destino: "/admin/mesas" },
    { texto: "Usuarios", destino: "/admin/usuarios" },
    { texto: "Reportes", destino: "/admin/reportes" },
    { texto: "Configuración", destino: "/admin/configuracion" }
];
export default function AdminLayout() {
    return (
        <>
            <div className="contenedor">
                <nav className="admin-nav" aria-label="Secciones de administración">
                    <ul className="admin-nav__lista">
                        {SECCIONES.map((seccion) => (
                            <li key={seccion.destino}>
                                <NavLink to={seccion.destino} className="admin-nav__enlace">
                                    {seccion.texto}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <Outlet />
        </>
    );
}
