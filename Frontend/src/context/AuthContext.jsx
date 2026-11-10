import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "../hooks/useToast.js";
import { getPerfil, login, registrarse } from "../services/authService.js";
import { borrarSesion, EVENTO_SESION_EXPIRADA, guardarSesion, obtenerSesion } from "../utils/sesion.js";
export const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => obtenerSesion()?.usuario ?? null);
    const { mostrarError } = useToast();
    const abrirSesion = useCallback((sesion) => {
        guardarSesion(sesion);
        setUsuario(sesion.usuario);
        return sesion.usuario;
    }, []);
    const iniciarSesion = useCallback(async (credenciales) => abrirSesion(await login(credenciales)), [abrirSesion]);
    const registrar = useCallback(async (datos) => abrirSesion(await registrarse(datos)), [abrirSesion]);
    const cerrarSesion = useCallback(() => {
        borrarSesion();
        setUsuario(null);
    }, []);
    useEffect(() => {
        const alExpirar = () => {
            setUsuario(null);
            mostrarError("Tu sesión expiró. Volvé a iniciar sesión.");
        };
        window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
        return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
    }, [mostrarError]);
    useEffect(() => {
        const sesion = obtenerSesion();
        if (!sesion) {
            return;
        }
        getPerfil()
            .then((perfil) => {
                guardarSesion({ ...sesion, usuario: perfil });
                setUsuario(perfil);
            })
            .catch(() => {});
    }, []);
    const valor = useMemo(() => ({
        usuario,
        iniciarSesion,
        registrar,
        cerrarSesion
    }), [usuario, iniciarSesion, registrar, cerrarSesion]);
    return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
