import { createContext, useCallback, useMemo, useState } from "react";
import ToastContainer from "../components/ToastContainer.jsx";
const DURACION_TOAST = 5000;
export const ToastContext = createContext(null);
let ultimoId = 0;
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const cerrarToast = useCallback((id) => {
        setToasts((actuales) => actuales.filter((toast) => toast.id !== id));
    }, []);
    const mostrarToast = useCallback((tipo, mensaje) => {
        ultimoId++;
        const id = ultimoId;
        setToasts((actuales) => [...actuales, { id, tipo, mensaje }]);
        setTimeout(() => cerrarToast(id), DURACION_TOAST);
    }, [cerrarToast]);
    const valor = useMemo(() => ({
        mostrarExito: (mensaje) => mostrarToast("exito", mensaje),
        mostrarError: (mensaje) => mostrarToast("error", mensaje)
    }), [mostrarToast]);
    return (
        <ToastContext.Provider value={valor}>
            {children}
            <ToastContainer toasts={toasts} onCerrar={cerrarToast} />
        </ToastContext.Provider>
    );
}
