import { startTransition, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Button from "./Button.jsx";
import Icono from "./Icono.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../hooks/useToast.js";
import { Rol } from "../utils/constantes.js";
import logo from "../assets/logo.svg";
import "./Navbar.css";
const ENLACES_PUBLICOS = [
    { texto: "Menú", destino: "/menu", ruta: true },
    { texto: "Eventos", destino: "/eventos", ruta: true },
    { texto: "Nosotros", destino: "/#nosotros" },
    { texto: "Contacto", destino: "#contacto" }
];
const ENLACES_POR_ROL = {
    [Rol.CLIENTE]: [{ texto: "Mis reservas", destino: "/mis-reservas" }],
    [Rol.EMPLEADO]: [{ texto: "Panel de reservas", destino: "/panel/reservas" }],
    [Rol.ADMINISTRADOR]: [
        { texto: "Panel de reservas", destino: "/panel/reservas" },
        { texto: "Administración", destino: "/admin" }
    ]
};
export default function Navbar() {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const { usuario, cerrarSesion } = useAuth();
    const { mostrarExito } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const [rutaAnterior, setRutaAnterior] = useState(location);
    if (rutaAnterior !== location) {
        setRutaAnterior(location);
        setMenuAbierto(false);
    }
    const enlacesPrivados = usuario ? ENLACES_POR_ROL[usuario.rol] ?? [] : [];
    const salir = () => {
        startTransition(() => {
            navigate("/");
            cerrarSesion();
        });
        mostrarExito("Cerraste sesión. ¡Te esperamos pronto!");
    };
    return (
        <header className="navbar">
            <div className="contenedor navbar__contenido">
                <Link to="/" className="navbar__marca">
                    <img src={logo} alt="" className="navbar__logo" width="48" height="48" />
                    <span className="navbar__nombre">CHS Burger</span>
                    <span className="visualmente-oculto">, ir al inicio</span>
                </Link>
                <button
                    type="button"
                    className="navbar__toggle"
                    aria-expanded={menuAbierto}
                    aria-controls="navegacion-principal"
                    onClick={() => setMenuAbierto((abierto) => !abierto)}
                >
                    <Icono nombre={menuAbierto ? "cerrar" : "menu"} tamanio={26} />
                    <span className="visualmente-oculto">{menuAbierto ? "Cerrar menú" : "Abrir menú"}</span>
                </button>
                <nav
                    id="navegacion-principal"
                    className={`navbar__nav${menuAbierto ? " navbar__nav--abierta" : ""}`}
                    aria-label="Navegación principal"
                >
                    <ul className="navbar__enlaces">
                        {ENLACES_PUBLICOS.map((enlace) => (
                            <li key={enlace.destino}>
                                {enlace.ruta ? (
                                    <NavLink to={enlace.destino} className="navbar__enlace navbar__enlace--seccion">{enlace.texto}</NavLink>
                                ) : enlace.destino.startsWith("#") ? (
                                    <a href={enlace.destino} className="navbar__enlace">{enlace.texto}</a>
                                ) : (
                                    <Link to={enlace.destino} className="navbar__enlace">{enlace.texto}</Link>
                                )}
                            </li>
                        ))}
                        {enlacesPrivados.map((enlace) => (
                            <li key={enlace.destino}>
                                <NavLink to={enlace.destino} className="navbar__enlace navbar__enlace--privado">
                                    {enlace.texto}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                    <div className="navbar__cuenta">
                        {usuario ? (
                            <>
                                <NavLink to="/perfil" className="navbar__saludo">
                                    Hola, {usuario.nombre}<span className="visualmente-oculto"> (mi perfil)</span>
                                </NavLink>
                                <Button variante="principal" tamanio="chico" onClick={salir}>
                                    Salir
                                </Button>
                            </>
                        ) : (
                            <>
                                <NavLink to="/ingresar" className="navbar__enlace navbar__enlace--privado">
                                    Ingresar
                                </NavLink>
                                <Button to="/registro" variante="accion" tamanio="chico" className="navbar__cta">
                                    Registrarse
                                </Button>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}
