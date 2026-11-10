import { useEffect, useId, useRef } from "react";
import Button from "./Button.jsx";
import Icono from "./Icono.jsx";
import "./ConfirmDialog.css";
export default function ConfirmDialog({
    abierto,
    titulo,
    descripcion,
    children,
    textoConfirmar = "Eliminar",
    textoCargando = "Eliminando…",
    cargando = false,
    onConfirmar,
    onCancelar
}) {
    const dialogo = useRef(null);
    const idTitulo = useId();
    const idDescripcion = useId();
    useEffect(() => {
        const elemento = dialogo.current;
        if (abierto && !elemento.open) {
            elemento.showModal();
        } else if (!abierto && elemento.open) {
            elemento.close();
        }
    }, [abierto]);
    const cancelar = (evento) => {
        evento.preventDefault();
        if (!cargando) {
            onCancelar();
        }
    };
    const cerrarAlTocarFondo = (evento) => {
        if (evento.target === dialogo.current) {
            cancelar(evento);
        }
    };
    return (
        <dialog
            ref={dialogo}
            className="dialogo"
            aria-labelledby={idTitulo}
            aria-describedby={idDescripcion}
            onCancel={cancelar}
            onClick={cerrarAlTocarFondo}
        >
            <div className="dialogo__contenido">
                <Icono nombre="alerta" tamanio={44} className="dialogo__icono" />
                <h2 id={idTitulo} className="dialogo__titulo">{titulo}</h2>
                <div id={idDescripcion} className="dialogo__texto">{descripcion}</div>
                {children && <div className="dialogo__extra">{children}</div>}
                <div className="dialogo__acciones">
                    <Button variante="secundario" onClick={onCancelar} disabled={cargando} autoFocus>
                        Cancelar
                    </Button>
                    <Button variante="accion" onClick={onConfirmar} cargando={cargando}>
                        {cargando ? textoCargando : textoConfirmar}
                    </Button>
                </div>
            </div>
        </dialog>
    );
}
