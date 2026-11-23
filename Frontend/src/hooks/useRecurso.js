import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "./useToast.js";
export function useRecurso(cargar, { notificarErrores = true } = {}) {
    const [estado, setEstado] = useState({ datos: null, cargando: true, error: null });
    const ultimaPeticion = useRef(0);
    const { mostrarError } = useToast();
    const recargar = useCallback(async () => {
        ultimaPeticion.current++;
        const peticion = ultimaPeticion.current;
        setEstado((previo) => ({ ...previo, cargando: true, error: null }));
        try {
            const datos = await cargar();
            if (peticion === ultimaPeticion.current) {
                setEstado({ datos, cargando: false, error: null });
            }
        } catch (error) {
            if (peticion === ultimaPeticion.current) {
                setEstado({ datos: null, cargando: false, error: error.message });
                if (notificarErrores) {
                    mostrarError(error.message);
                }
            }
        }
    }, [cargar, mostrarError, notificarErrores]);
    useEffect(() => {
        recargar();
    }, [recargar]);
    const setDatos = useCallback((actualizar) => {
        setEstado((previo) => ({
            ...previo,
            datos: typeof actualizar === "function" ? actualizar(previo.datos) : actualizar
        }));
    }, []);
    return { ...estado, recargar, setDatos };
}
