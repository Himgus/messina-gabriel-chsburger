import Button from "../components/Button.jsx";
import MensajeEstado from "../components/MensajeEstado.jsx";
import { useTituloPagina } from "../hooks/useTituloPagina.js";
export default function NotFoundPage() {
    useTituloPagina("Página no encontrada");
    return (
        <div className="contenedor pagina">
            <h1 className="visualmente-oculto">Página no encontrada</h1>
            <MensajeEstado
                tipo="vacio"
                titulo="Esta página no existe"
                accion={<Button to="/" variante="accion">Volver al inicio</Button>}
            >
                <p>Puede que el enlace esté mal escrito o que la página se haya movido.</p>
            </MensajeEstado>
        </div>
    );
}
