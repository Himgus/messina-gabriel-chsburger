import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "../hooks/useToast.js";
import { getPerfil, login, registrarse, updatePerfil } from "../services/authService.js";
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
    const actualizarPerfil = useCallback(async (datos) => {
        const perfil = await updatePerfil(datos);
        guardarSesion({ ...obtenerSesion(), usuario: perfil });
        setUsuario(perfil);
        return perfil;
    }, []);
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
                if (obtenerSesion()?.token !== sesion.token) {
                    return;
                }
                guardarSesion({ ...sesion, usuario: perfil });
                setUsuario(perfil);
            })
            .catch(() => {});
    }, []);
    const valor = useMemo(() => ({
        usuario,
        iniciarSesion,
        registrar,
        actualizarPerfil,
        cerrarSesion
    }), [usuario, iniciarSesion, registrar, actualizarPerfil, cerrarSesion]);
    return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
